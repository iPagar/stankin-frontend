import {
  Button,
  Div,
  Group,
  Header,
  InfoRow,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  SimpleCell,
  Spinner,
} from "@vkontakte/vkui";
import { useAppSelector } from "../api/store";
import { useStudentScheduleControllerGetTeacherLatestScheduleQuery } from "../api/slices/students.slice";
import { SubjectDto } from "../api/slices/student-schedule.slice";
import moment from "moment";
import LessonCell from "../cells/LessonCell";
import { Icon24Back } from "@vkontakte/icons";

export function TeacherModal({
  onClose,
  onActiveModalChange,
  activeModal,
}: {
  activeModal: string | null;
  onClose?: () => void;
  onActiveModalChange?: (activeModal: string) => void;
}) {
  const teacher = useAppSelector((state) => state.schedule.selectedTeacher);

  if (!teacher) {
    return (
      <ModalRoot
        activeModal={activeModal}
        onClose={() => {
          onClose && onClose();
        }}
      >
        <ModalPage id="teacher">Преподаватель не найден</ModalPage>
      </ModalRoot>
    );
  }

  return (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => {
        onClose && onClose();
      }}
    >
      <ModalPage
        id="teacher"
        header={<ModalPageHeader>{teacher.fio}</ModalPageHeader>}
      >
        <Group>
          <SimpleCell>
            <InfoRow header="ФИО">{teacher.name}</InfoRow>
          </SimpleCell>
          <SimpleCell>
            <InfoRow header="Должность">{teacher.position}</InfoRow>
          </SimpleCell>
          <SimpleCell>
            <InfoRow header="Квалификация">{teacher.qualification}</InfoRow>
          </SimpleCell>
          <SimpleCell multiline>
            <InfoRow header="Предметы">
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 16,
                }}
              >
                {teacher.subjects.split(";").map((subject, i) => (
                  <li key={i}>{subject}</li>
                ))}
              </ul>
            </InfoRow>
          </SimpleCell>
        </Group>
        <Group>
          <SimpleCell>
            <Button
              onClick={() => {
                onActiveModalChange?.("teacher-schedule");
              }}
              mode="secondary"
            >
              Расписание
            </Button>
          </SimpleCell>
        </Group>
      </ModalPage>
      <TeacherSchedulePage
        id="teacher-schedule"
        name={teacher.fio}
        onBack={() => {
          onActiveModalChange?.("teacher");
        }}
      />
    </ModalRoot>
  );
}

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
  const groupedByDate = latest?.reduce((acc, item) => {
    const date = moment(item.start_date).format("L");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, SubjectDto[]>);

  return (
    <ModalPage
      id={id}
      settlingHeight={100}
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
        ) : Object.keys(groupedByDate || {}).length ? (
          Object.entries(groupedByDate || {}).map(([date, lessons]) => (
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
