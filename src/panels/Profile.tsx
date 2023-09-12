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
  GetStudentDto,
  useStudentsControllerGetMeQuery,
} from "../api/slices/students.slice";

function Exit(props: { onExit: () => void }) {
  return (
    <CellButton mode={"danger"} onClick={props.onExit}>
      Выйти
    </CellButton>
  );
}

function ProfileData(props: { student: GetStudentDto }) {
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
  const { data: student, error, isLoading } = useStudentsControllerGetMeQuery();

  return (
    <Panel id={props.id} separator={false}>
      <PanelHeaderSimple left={<PanelHeaderBack onClick={props.onBack} />}>
        Профиль
      </PanelHeaderSimple>
      {isLoading && <Spinner size="large" />}
      {!isLoading &&
        (student ? (
          <React.Fragment>
            <ProfileData student={student} />
            <List>
              <Exit onExit={props.onExit} />
            </List>
          </React.Fragment>
        ) : (
          <Placeholder
            action={
              <Button size="l" onClick={props.onEnter}>
                Войти
              </Button>
            }
            icon={<Icon56UserCircleOutline />}
            stretched
          />
        ))}
    </Panel>
  );
}

export default Profile;
