import {
  Button,
  Group,
  InfoRow,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  SimpleCell,
} from "@vkontakte/vkui";
import { useAppSelector } from "../api/store";
import { TeacherSchedulePage } from "./teacher-schedule-page";

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
        {teacher.data && (
          <Group>
            <SimpleCell>
              <InfoRow header="ФИО">{teacher.data.name}</InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Должность">{teacher.data.position}</InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Квалификация">
                {teacher.data.qualification}
              </InfoRow>
            </SimpleCell>
            <SimpleCell multiline>
              <InfoRow header="Предметы">
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 16,
                  }}
                >
                  {teacher.data.subjects.split(";").map((subject, i) => (
                    <li key={i}>{subject}</li>
                  ))}
                </ul>
              </InfoRow>
            </SimpleCell>
          </Group>
        )}
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
