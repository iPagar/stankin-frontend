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
          }}
        >
          {sortedByOccupied?.map((audience, i) => {
            const occupied = audience.lessons.some((lesson) => {
              const start = moment(lesson.start_date);
              const end = moment(lesson.end_date);
              const now = moment(today);

              const isOccupied = now.isBetween(start, end);

              return isOccupied;
            });
            const occupiedBy = audience.lessons.find((lesson) => {
              const start = moment(lesson.start_date);
              const end = moment(lesson.end_date);
              const now = moment(today);

              const isOccupied = now.isBetween(start, end);

              return isOccupied;
            });

            return (
              <SimpleCell
                key={i}
                onClick={() => {
                  props.onAudienceClick?.(audience.name);
                }}
                after={
                  occupiedBy ? (
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
                          color: "var(--text_secondary)",
                        }}
                      >
                        {occupiedBy.teacher}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text_secondary)",
                        }}
                      >
                        {occupiedBy.stgroup}
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                }
              >
                {audience.name}
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
