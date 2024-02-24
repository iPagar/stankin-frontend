import {
  Div,
  Group,
  Header,
  List,
  SimpleCell,
  Spinner,
  Subhead,
} from "@vkontakte/vkui";
import { useStudentScheduleControllerGetAudienceScheduleQuery } from "../api/slices/students.slice";
import LessonCell from "../cells/LessonCell";
import moment from "moment";
import { SubjectDto } from "../api/slices/student-schedule.slice";

export function Audience(props: { name: string }) {
  const { data, isLoading } =
    useStudentScheduleControllerGetAudienceScheduleQuery({
      audience: props.name,
    });

  if (isLoading) {
    return <Spinner size="large" style={{ marginTop: 20 }} />;
  }

  const groupByDate = data?.reduce((acc, lesson) => {
    const date = moment(lesson.start_date).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(lesson);
    return acc;
  }, {} as Record<string, SubjectDto[]>);

  return (
    <Div>
      <Header
        mode="secondary"
        style={{
          padding: 0,
        }}
      >
        Занятия на ближайшие 14 дней
      </Header>

      <List>
        {Object.entries(groupByDate || {}).map(([date, lessons]) => {
          return (
            <Group
              mode="plain"
              key={date}
              header={moment(date).format("DD MMMM")}
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
        {Object.keys(groupByDate || {}).length === 0 && (
          <Subhead style={{ textAlign: "center", marginTop: 20 }}>
            Занятий не найдено
          </Subhead>
        )}
      </List>
    </Div>
  );
}
