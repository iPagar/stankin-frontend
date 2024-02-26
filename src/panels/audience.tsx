import { Div, Group, Header, List, Spinner, Subhead } from "@vkontakte/vkui";
import { useStudentScheduleControllerGetAudienceScheduleQuery } from "../api/slices/students.slice";
import LessonCell from "../cells/LessonCell";
import moment from "moment";
import { groupByDateAndStgroup } from "../views/schedule-utils";

export function Audience(props: { name: string }) {
  const { data, isLoading } =
    useStudentScheduleControllerGetAudienceScheduleQuery({
      audience: props.name,
    });

  if (isLoading) {
    return <Spinner size="large" style={{ marginTop: 20, height: 200 }} />;
  }

  const grouped = groupByDateAndStgroup(data || []);

  return (
    <Div
      style={{
        paddingBottom: 60,
      }}
    >
      <Header
        mode="secondary"
        style={{
          padding: 0,
        }}
      >
        Занятия на ближайшие 14 дней
      </Header>

      <List>
        {Object.entries(grouped || {}).map(([date, lessons]) => {
          return (
            <Group
              mode="plain"
              key={date}
              header={moment(date, "DD.MM.YYYY").format("DD MMMM, dddd")}
              separator="hide"
              style={{
                margin: 0,
                padding: "12px 0",
                gap: 8,
                display: "flex",
                flexDirection: "column",
                background: "transparent",
              }}
            >
              {lessons.map((lesson) => {
                return (
                  <LessonCell
                    key={lesson._id}
                    hideAudience
                    lesson={{
                      start_time: moment(lesson.start_date).format("HH:mm"),
                      end_time: moment(lesson.end_date).format("HH:mm"),
                      audience: lesson.audience,
                      subject: lesson.subject,
                      type: lesson.type,
                      teacher: lesson.teacher,
                      stgroup: lesson.stgroup,
                    }}
                  />
                );
              })}
            </Group>
          );
        })}
        {Object.keys(grouped || {}).length === 0 && (
          <Subhead style={{ textAlign: "center", marginTop: 20 }}>
            Занятий не найдено
          </Subhead>
        )}
      </List>
    </Div>
  );
}
