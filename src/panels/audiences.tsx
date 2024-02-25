import {
  Div,
  FixedLayout,
  List,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Search,
  Separator,
  SimpleCell,
  Spinner,
} from "@vkontakte/vkui";
import { useState } from "react";
import { useStudentScheduleControllerGetAudienciesQuery } from "../api/slices/student-schedule.slice";
import moment from "moment";
import { groupByDateAndStgroup } from "../views/schedule-utils";

export function Audiences(props: {
  id: string;
  onCancelClick?: () => void;
  onAudienceClick?: (audience: string) => void;
}) {
  const today = moment().toDate();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useStudentScheduleControllerGetAudienciesQuery({
    date: moment(today).format("YYYY-MM-DD"),
  });
  const filteredData = data?.filter((audience) =>
    audience.name.toLowerCase().includes(search.toLowerCase())
  );
  const sortedByOccupied = filteredData?.sort((a, b) => {
    const aOccupied = a.lessons.some((lesson) => {
      const start = moment(lesson.start_date);
      const end = moment(lesson.end_date);
      const now = moment(today);
      return now.isBetween(start, end);
    });
    const bOccupied = b.lessons.some((lesson) => {
      const start = moment(lesson.start_date);
      const end = moment(lesson.end_date);
      const now = moment(today);
      return now.isBetween(start, end);
    });
    if (aOccupied && !bOccupied) return -1;
    if (!aOccupied && bOccupied) return 1;
    return 0;
  });

  return (
    <Panel id={props.id}>
      <PanelHeader
        delimiter="spacing"
        before={<PanelHeaderBack onClick={props.onCancelClick} />}
      >
        Аудитории
      </PanelHeader>
      <FixedLayout vertical="top" filled>
        <Search
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <Separator wide />
      </FixedLayout>
      {isLoading && <Spinner size="large" style={{ marginTop: 60 }} />}
      <Div>
        <List
          style={{
            paddingTop: 60,
            paddingBottom: 60,
          }}
        >
          {sortedByOccupied?.map((audience, i) => {
            const grouped = groupByDateAndStgroup(audience.lessons);

            const occupiedBy = Object.entries(grouped).reduce(
              (acc, [date, lessons]) => {
                const found = lessons.find((lesson) => {
                  const start = moment(lesson.start_date);
                  const end = moment(lesson.end_date);
                  const now = moment(today);

                  const isOccupied = now.isBetween(start, end);

                  return isOccupied;
                });

                if (found) {
                  acc.push({
                    stgroup: found.stgroup,
                    teacher: found.teacher,
                  });
                }

                return acc;
              },
              [] as {
                stgroup: string;
                teacher: string;
              }[]
            );
            const isOccupied = occupiedBy.length > 0;

            return (
              <SimpleCell
                key={i}
                onClick={() => {
                  props.onAudienceClick?.(audience.name);
                }}
                after={
                  isOccupied ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#aebfcf",
                          }}
                        >
                          {occupiedBy[0].teacher}
                        </span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                }
              >
                {audience.name}{" "}
                {isOccupied && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="5" fill="#FF3347" />
                  </svg>
                )}
              </SimpleCell>
            );
          })}
          {!isLoading && filteredData?.length === 0 && (
            <Div>
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text_secondary)",
                  marginTop: 20,
                  marginBottom: 5,
                }}
              >
                Ничего не найдено
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text_secondary)",
                  fontSize: 12,
                }}
              >
                Если аудитории нет в списке, то в ней нет занятий
              </div>
            </Div>
          )}
        </List>
      </Div>
    </Panel>
  );
}
