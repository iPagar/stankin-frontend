import { Icon16Dropdown } from "@vkontakte/icons";
import {
  Group,
  List,
  PanelHeaderBack,
  PanelHeaderContent,
  PanelHeaderSimple,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useAppControllerGetSemestersQuery } from "../api/slices/app.slice";
import {
  useStudentsControllerGetAllQuery,
  useStudentsControllerGetRatingQuery,
} from "../api/slices/students.slice";
import TopCell from "./TopCell";

const semesterFormat = (semester: string) => {
  if (semester.length !== 10) return semester;

  return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
};

export default function TopList(props: { onCancelClick: () => void }) {
  const [contextOpened, setContextOpened] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const { data: semesters } = useAppControllerGetSemestersQuery();
  const { data: students } = useStudentsControllerGetRatingQuery({
    semester: selectedSemester,
  });

  useEffect(() => {
    if (semesters) {
      setSelectedSemester(semesters[semesters.length - 1]);
    }
  }, [semesters]);

  return (
    <>
      <PanelHeaderSimple
        separator={false}
        left={<PanelHeaderBack onClick={props.onCancelClick} />}
      >
        <PanelHeaderContent
          aside={
            <Icon16Dropdown
              style={{
                transform: `rotate(${contextOpened ? "180deg" : "0"})`,
              }}
            />
          }
          onClick={() => {
            setContextOpened(!contextOpened);
          }}
          before={undefined}
          status={undefined}
        >
          {semesterFormat(selectedSemester)}
        </PanelHeaderContent>
      </PanelHeaderSimple>
      <List>
        {students?.data.map((student) => (
          <TopCell key={student.id} {...student} />
        ))}
      </List>
    </>
  );
}
