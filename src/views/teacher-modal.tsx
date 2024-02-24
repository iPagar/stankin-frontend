import {
  Group,
  Header,
  InfoRow,
  ModalPage,
  ModalRoot,
  SimpleCell,
} from "@vkontakte/vkui";
import { useState } from "react";
import { useAppSelector } from "../api/store";

export function TeacherModal({ onClose }: { onClose?: () => void }) {
  const teacher = useAppSelector((state) => state.schedule.selectedTeacher);

  if (!teacher) {
    return <div>Преподаватель не найден</div>;
  }

  return (
    <ModalRoot
      activeModal={"teacher"}
      onClose={() => {
        onClose && onClose();
      }}
    >
      <ModalPage id="teacher">
        <Group header={<Header mode="secondary">{teacher.name}</Header>}>
          <SimpleCell>
            <InfoRow header="Должность">{teacher.position}</InfoRow>
          </SimpleCell>
          <SimpleCell>
            <InfoRow header="Квалификация">{teacher.qualification}</InfoRow>
          </SimpleCell>

          <SimpleCell>
            <InfoRow header="Предметы">{teacher.subjects}</InfoRow>
          </SimpleCell>
        </Group>
      </ModalPage>
    </ModalRoot>
  );
}
