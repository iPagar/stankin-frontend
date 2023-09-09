import React from "react";
import {
  Panel,
  PanelHeaderSimple,
  PanelHeaderContext,
  PanelHeaderContent,
  List,
  Cell,
  FixedLayout,
  Tabs,
  HorizontalScroll,
  TabsItem,
  PanelHeaderButton,
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import { selectSemester, setActiveTopTab, notify } from "../redux/actions";

import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon24Done from "@vkontakte/icons/dist/24/done";

import Table from "./Table";

import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon24NotificationDisable from "@vkontakte/icons/dist/24/notification_disable";
import {
  Icon24HistoryBackwardOutline,
  Icon28ChevronBack,
} from "@vkontakte/icons";
import { MarksHistory } from "./marks-history";

const mapStateToProps = (state) => {
  return {
    student: state.init.student,
    selectedSemester: state.init.selectedSemester,
    semesters: state.init.semesters,
    marks: state.init.marks[state.init.selectedSemester],
    scheme: state.config.scheme,
    activeTopTab: state.config.activeTopTab,
    activeBottomTab: state.config.activeBottomTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNotifyClick: () => {
      dispatch(notify());
    },
    onCellClick: (tag) => {
      dispatch(selectSemester(tag));
    },
    onTopTab: (tag) => {
      dispatch(setActiveTopTab(tag));
    },
  };
};

class Marks extends React.Component {
  state = {
    contextOpened: false,
    isFetching: false,
    popout: null,
    tooltip: false,
    login: "",
    password: "",
    panel: "marks",
  };

  toggleContext = () => {
    this.setState({ contextOpened: !this.state.contextOpened });
  };

  select = (e) => {
    const tag = e.currentTarget.dataset.tag;

    this.props.onCellClick(tag);

    window.scrollTo(0, 0);
    requestAnimationFrame(this.toggleContext);
  };

  semesterFormat(semester) {
    return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
  }

  selectTopTab = (e) => {
    const { contextOpened } = this.state;
    const tag = e.currentTarget.dataset.tag;

    if (contextOpened) requestAnimationFrame(this.toggleContext);
    this.props.onTopTab(tag);
  };

  renderPanelHeaderContext() {
    const { semesters, selectedSemester, activeTopTab } = this.props;

    return (
      <PanelHeaderContext
        opened={this.state.contextOpened}
        onClose={this.toggleContext}
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
            {semesters.map((semester, i) => (
              <Cell
                key={i}
                data-tag={i}
                asideContent={
                  selectedSemester === i ? (
                    <Icon24Done fill="var(--accent)" />
                  ) : null
                }
                onClick={this.select}
              >
                {this.semesterFormat(semester)}
              </Cell>
            ))}
          </List>
        </div>
      </PanelHeaderContext>
    );
  }

  render() {
    const { semesters, marks, selectedSemester, activeTopTab } = this.props;
    const semester = this.semesterFormat(semesters[selectedSemester]);
    const { panel } = this.state;

    return (
      <Panel
        id="marks"
        theme="white"
        centered={activeTopTab === "marks" && panel === "marks"}
        separator={false}
      >
        <PanelHeaderSimple
          separator={false}
          left={
            <PanelHeaderButton>
              {panel === "marks" && (
                <>
                  <div
                    onClick={async () => {
                      if (
                        this.props.student.hasOwnProperty("student") &&
                        !this.props.student.notify
                      ) {
                        const drPr = await bridge.send(
                          "VKWebAppAllowMessagesFromGroup",
                          {
                            group_id: 183639424,
                            key: "dBuBKe1kFcdemzB",
                          }
                        );

                        if (drPr.result === true) this.props.onNotifyClick();
                      } else this.props.onNotifyClick();
                    }}
                  >
                    {this.props.student.notify ? (
                      <Icon24NotificationDisable />
                    ) : (
                      <Icon24Notification />
                    )}
                  </div>
                  <Icon24HistoryBackwardOutline
                    onClick={() => {
                      this.setState({ panel: "marks_history" });
                    }}
                  />
                </>
              )}
              {panel === "marks_history" && (
                <Icon28ChevronBack
                  onClick={() => {
                    this.setState({ panel: "marks" });
                  }}
                />
              )}
            </PanelHeaderButton>
          }
        >
          {panel === "marks" && (
            <PanelHeaderContent
              aside={
                <Icon16Dropdown
                  style={{
                    transform: `rotate(${
                      this.state.contextOpened ? "180deg" : "0"
                    })`,
                  }}
                />
              }
              onClick={this.toggleContext}
            >
              {semester}
            </PanelHeaderContent>
          )}
          {panel === "marks_history" && (
            <PanelHeaderContent>История</PanelHeaderContent>
          )}
        </PanelHeaderSimple>

        {this.renderPanelHeaderContext()}
        {panel === "marks" && <Table marks={marks} semester={semester} />}
        {panel === "marks_history" && <MarksHistory />}
      </Panel>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Marks);
