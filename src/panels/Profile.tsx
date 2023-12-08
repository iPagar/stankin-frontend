import React from "react";
import {
  Panel,
  PanelHeaderBack,
  PanelHeaderSimple,
  List,
  Cell,
  Header,
  InfoRow,
  CellButton,
  Placeholder,
  Button,
  Spinner,
} from "@vkontakte/vkui";

import { Icon56UserCircleOutline } from "@vkontakte/icons";
import {
  StudentDto,
  useStudentsControllerGetMeQuery,
  useStudentsControllerLogoutMutation,
} from "../api/slices/students.slice";
import { api } from "../api/api";
import { useAppDispatch } from "../api/store";

function Exit(props: { onExit: () => void }) {
  const [logout, { isLoading: isLogoutLoading }] =
    useStudentsControllerLogoutMutation();
  const dispatch = useAppDispatch();

  return (
    <CellButton
      mode={"danger"}
      onClick={async () => {
        props.onExit();
        await logout().unwrap();
        dispatch(api.util.resetApiState());
      }}
      disabled={isLogoutLoading}
    >
      Выйти
    </CellButton>
  );
}

function ProfileData(props: { student: StudentDto }) {
  return (
    <div>
      <Header>Информация о студенте</Header>
      <List>
        <Cell>
          <InfoRow header="ФИО">
            {`${props.student.surname} ${props.student.initials}`}
          </InfoRow>
        </Cell>
        <Cell>
          <InfoRow header="Студенческий билет">{props.student.student}</InfoRow>
        </Cell>
        <Cell>
          <InfoRow header="Группа">{props.student.stgroup}</InfoRow>
        </Cell>
      </List>
    </div>
  );
}

function Profile(props: {
  id: string;
  onExit: () => void;
  onEnter: () => void;
  onBack: () => void;
}) {
  const { data: student, isLoading } = useStudentsControllerGetMeQuery();

  return (
    <Panel id={props.id} separator={false}>
      <PanelHeaderSimple left={<PanelHeaderBack onClick={props.onBack} />}>
        Профиль
      </PanelHeaderSimple>

      {isLoading && <Spinner size="large" />}
      {student && (
        <React.Fragment>
          <ProfileData student={student} />
          <List>
            <Exit onExit={props.onBack} />
          </List>
        </React.Fragment>
      )}
    </Panel>
  );
}

export default Profile;
