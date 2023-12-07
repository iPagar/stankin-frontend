import React, { useEffect } from "react";
import {
  Panel,
  PanelHeaderSimple,
  PanelHeaderContext,
  PanelHeaderContent,
  List,
  Cell,
  PanelHeaderButton,
  Spinner,
} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";

import {
  Icon16Dropdown,
  Icon24Done,
  Icon24Notification,
  Icon24NotificationDisable,
} from "@vkontakte/icons";

import Table from "./Table";

import {
  Icon24HistoryBackwardOutline,
  Icon28ChevronBack,
} from "@vkontakte/icons";
import { MarksHistory } from "./marks-history";
import {
  useMarksControllerGetSemesterMarksQuery,
  useMarksControllerNotifyQuery,
  useMarksControllerSwitchNotifyMutation,
} from "../api/slices/marks.slice";
import { create } from "zustand";
import {
  useStudentsControllerGetMeQuery,
  useStudentsControllerGetStudentSemestersQuery,
} from "../api/slices/students.slice";
import { useAppDispatch } from "../api/store";
import { setView } from "../redux/actions";

export type MarksStore = {
  contextOpened: boolean;
  isFetching: boolean;
  popout: null;
  tooltip: boolean;
  login: string;
  password: string;
  panel: string;
  selectedSemester?: string;
};

const marksStore = create<{
  data: MarksStore;
  setData: (data: Partial<MarksStore>) => void;
}>(() => ({
  data: {
    contextOpened: false,
    isFetching: false,
    popout: null,
    tooltip: false,
    login: "",
    password: "",
    panel: "marks",
  },
  setData: (data) => {
    marksStore.setState({ data: { ...marksStore.getState().data, ...data } });
  },
}));

function Marks() {
  const { data: me } = useStudentsControllerGetMeQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!me) {
      dispatch(setView("loginView"));
    }
  }, [me]);

  const { data, setData } = marksStore();

  const toggleContext = () => {
    setData({ contextOpened: !data.contextOpened });
  };

  const select = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const tag = e.currentTarget.dataset.tag;

    setData({
      selectedSemester: tag,
    });

    window.scrollTo(0, 0);
    requestAnimationFrame(toggleContext);
  };

  function semesterFormat(semester: string) {
    return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
  }

  function renderPanelHeaderContext() {
    const { data: semesters, error } =
      useStudentsControllerGetStudentSemestersQuery();

    return (
      <PanelHeaderContext
        opened={data.contextOpened}
        onClose={toggleContext}
        style={{
          marginTop: 0,
        }}
      >
        <div
          style={{
            marginTop: 0,
          }}
        >
          <List>
            {semesters?.map((semester, i) => (
              <Cell
                key={i}
                data-tag={semester}
                asideContent={
                  data.selectedSemester &&
                  data.selectedSemester === semester ? (
                    <Icon24Done fill="var(--accent)" />
                  ) : null
                }
                onClick={select}
              >
                {semesterFormat(semester)}
              </Cell>
            ))}
          </List>
        </div>
      </PanelHeaderContext>
    );
  }

  const { data: semesters } = useStudentsControllerGetStudentSemestersQuery();

  useEffect(() => {
    if (semesters && !data.selectedSemester) {
      setData({
        selectedSemester: semesters[semesters.length - 1],
      });
    }
  }, [semesters]);

  const semester = data.selectedSemester
    ? semesterFormat(data.selectedSemester)
    : null;
  const { data: marks } = useMarksControllerGetSemesterMarksQuery(
    {
      semester: data.selectedSemester!,
    },
    {
      skip: !data.selectedSemester,
    }
  );

  const { data: isNotify } = useMarksControllerNotifyQuery();
  const [notify] = useMarksControllerSwitchNotifyMutation();
  const [marksTable, setMarksTable] = React.useState(
    marks ? <Table data={marks} key={data.selectedSemester} /> : null
  );

  useEffect(() => {
    if (marks) {
      setMarksTable(<Table data={marks} key={data.selectedSemester} />);
    }
  }, [marks]);

  return (
    <Panel id="marks" centered separator={false}>
      <PanelHeaderSimple
        separator={false}
        left={
          <PanelHeaderButton>
            {data.panel === "marks" && (
              <>
                <div
                  onClick={async () => {
                    if (!isNotify) {
                      const drPr = await bridge.send(
                        "VKWebAppAllowMessagesFromGroup",
                        {
                          group_id: 183639424,
                          key: "dBuBKe1kFcdemzB",
                        }
                      );

                      if (drPr.result === true) {
                        await notify().unwrap();
                      }
                    } else {
                      await notify().unwrap();
                    }
                  }}
                >
                  {isNotify ? (
                    <Icon24NotificationDisable />
                  ) : (
                    <Icon24Notification />
                  )}
                </div>
                <Icon24HistoryBackwardOutline
                  onClick={() => {
                    setData({
                      panel: "marks_history",
                    });
                  }}
                />
              </>
            )}
            {data.panel === "marks_history" && (
              <Icon28ChevronBack
                onClick={() => {
                  setData({
                    panel: "marks",
                  });
                }}
              />
            )}
          </PanelHeaderButton>
        }
      >
        {data.panel === "marks" &&
          (semester ? (
            <PanelHeaderContent
              aside={
                <Icon16Dropdown
                  style={{
                    transform: `rotate(${data.contextOpened ? "180deg" : "0"})`,
                  }}
                />
              }
              onClick={toggleContext}
              before={undefined}
              status={undefined}
            >
              {semester}
            </PanelHeaderContent>
          ) : (
            <Spinner />
          ))}
        {data.panel === "marks_history" && (
          <PanelHeaderContent
            aside={undefined}
            before={undefined}
            status={undefined}
          >
            История
          </PanelHeaderContent>
        )}
      </PanelHeaderSimple>

      {renderPanelHeaderContext()}
      {data.panel === "marks" && marks ? marksTable : <Spinner size="large" />}
      {data.panel === "marks_history" && <MarksHistory />}
    </Panel>
  );
}

export default Marks;
