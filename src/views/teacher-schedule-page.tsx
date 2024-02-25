import {
  Div,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  SimpleCell,
  Spinner,
} from "@vkontakte/vkui";
import { useStudentScheduleControllerGetTeacherLatestScheduleQuery } from "../api/slices/students.slice";
import moment from "moment";
import LessonCell from "../cells/LessonCell";
import { Icon24Back } from "@vkontakte/icons";
import { groupByDateAndStgroup } from "./schedule-utils";

export function TeacherSchedulePage({
  id,
  name,
  onBack,
}: {
  id: string;
  name: string;
  onBack?: () => void;
}) {
  const { data: latest, isLoading } =
    useStudentScheduleControllerGetTeacherLatestScheduleQuery({
      name,
    });
  const grouped = groupByDateAndStgroup(latest || []);

  return (
    <ModalPage
      id={id}
      dynamicContentHeight
      header={
        <ModalPageHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => {
                onBack?.();
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <Icon24Back />
            </div>
            <Header mode="secondary" subtitle="Ближайшие занятия (14 дней)">
              Расписание преподавателя
            </Header>
          </div>
        </ModalPageHeader>
      }
    >
      <Div>
        {isLoading ? (
          <Spinner size="large" style={{ margin: "20px 0" }} />
        ) : Object.keys(grouped || {}).length ? (
          Object.entries(grouped || {}).map(([date, lessons]) => (
            <Group
              header={
                <Header mode="secondary">
                  {moment(date, "L").format("D MMMM, dddd")}
                </Header>
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              separator="hide"
            >
              {lessons.map((item) => (
                <LessonCell
                  lesson={{
                    audience: item.audience,
                    subject: item.subject,
                    type: item.type,
                    end_time: moment(item.end_date)
                      .add(100, "minute")
                      .format("LT"),
                    start_time: moment(item.start_date).format("LT"),
                    stgroup: item.stgroup,
                  }}
                />
              ))}
            </Group>
          ))
        ) : (
          <Group>
            <SimpleCell>Занятия отсутствуют</SimpleCell>
          </Group>
        )}
      </Div>
    </ModalPage>
  );
}
