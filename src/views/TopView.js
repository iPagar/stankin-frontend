import React from "react";
import {
  View,
  Panel,
  PanelHeader,
  Group,
  List,
  Spinner,
  PanelHeaderContent,
  HeaderContext,
  Div,
  Cell,
  PopoutWrapper,
  getClassName,
  ScreenSpinner
} from "@vkontakte/vkui";
import Icon44Cancel from "../img/Icon44Cancel.svg";
import Icon44Done from "../img/Icon44Done.svg";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import DataManager from "../services/DataManager";
import connect from "@vkontakte/vk-connect";
import TopCell from "../services/TopCell";

let topCells = [];
let topCellsStgroup = [];

class TopView extends React.Component {
  state = {
    topCells: [],
    isLoading: false,
    contextOpened: false,
    top: "Топ Станкина",
    popout: null
  };

  loadTop() {
    const { top } = DataManager;

    if (top.length && !topCells.length) {
      this.setState({ isLoading: true });
      connect
        .sendPromise("VKWebAppGetAuthToken", {
          app_id: 7010368,
          scope: ""
        })
        .then(resp =>
          connect
            .sendPromise("VKWebAppCallAPIMethod", {
              method: "users.get",
              request_id: 1,
              params: {
                user_ids: top
                  .reduce((str, group) => {
                    group.students.forEach(student => str.push(student.id));
                    return str;
                  }, [])
                  .toString(),
                fields: "photo_50",
                v: "5.95",
                access_token: resp.data.access_token
              }
            })
            .then(users => {
              let index = 0;
              return top.map((group, i) => {
                index = index + group.students.length;

                return (
                  <Group key={i} style={{ margin: 0 }} title={`${i + 1} место`}>
                    {group.students.map((student, j) => {
                      const ind = index - group.students.length + j;

                      return (
                        <TopCell
                          key={student.id}
                          itsme={DataManager.id === student.id}
                          position={i + 1}
                          isgroup={!j ? true : false}
                          person={{
                            id: student.id,
                            stgroup: student.stgroup,
                            mark: group.mark
                          }}
                          user={users.data.response[ind]}
                        />
                      );
                    })}
                  </Group>
                );
              });
            })
            .then(cells => {
              this.setState({ topCells: cells, isLoading: false });
              topCells = cells;
            })
        )
        .catch(() => this.setState({ isLoading: false }));
    } else this.setState({ topCells, isLoading: false });
  }

  loadTopStgroup() {
    const { topStgroup } = DataManager;

    if (topStgroup.length && !topCellsStgroup.length) {
      this.setState({ isLoading: true });
      connect
        .sendPromise("VKWebAppGetAuthToken", {
          app_id: 7010368,
          scope: ""
        })
        .then(resp =>
          connect
            .sendPromise("VKWebAppCallAPIMethod", {
              method: "users.get",
              request_id: 1,
              params: {
                user_ids: topStgroup
                  .reduce((str, group) => {
                    group.students.forEach(student => str.push(student.id));
                    return str;
                  }, [])
                  .toString(),
                fields: "photo_50",
                v: "5.95",
                access_token: resp.data.access_token
              }
            })
            .then(users => {
              console.log(users);
              let index = 0;
              return topStgroup.map((group, i) => {
                index = index + group.students.length;
                return (
                  <Group key={i} style={{ margin: 0 }} title={`${i + 1} место`}>
                    {group.students.map((student, j) => {
                      const ind = index - group.students.length + j;

                      return (
                        <TopCell
                          key={student.id}
                          itsme={DataManager.id === student.id}
                          position={i + 1}
                          isgroup={!j ? true : false}
                          person={{
                            id: student.id,
                            stgroup: student.stgroup,
                            mark: group.mark
                          }}
                          user={users.data.response[ind]}
                        />
                      );
                    })}
                  </Group>
                );
              });
            })
            .then(cells => {
              this.setState({ topCells: cells, isLoading: false });
              topCellsStgroup = cells;
            })
        )
        .catch(() => this.setState({ isLoading: false }));
    } else this.setState({ topCells: topCellsStgroup, isLoading: false });
  }

  componentDidMount() {
    this.loadTop();

    if (!DataManager.top_notify && DataManager.top.length === 0)
      connect.sendPromise("VKWebAppGetUserInfo", {}).then(user =>
        connect
          .sendPromise("VKWebAppGetAuthToken", {
            app_id: 7010368,
            scope: ""
          })
          .then(resp =>
            connect
              .sendPromise("VKWebAppCallAPIMethod", {
                method: "apps.isNotificationsAllowed",
                request_id: "1",
                params: {
                  user_id: user.data.id,
                  v: "5.101",
                  access_token: resp.data.access_token
                }
              })
              .then(resp => {
                if (!resp.data.is_allowed)
                  connect
                    .sendPromise("VKWebAppAllowNotifications", {})
                    .then(() => {
                      this.setState({ popout: <ScreenSpinner /> });
                      DataManager.setTopNotify(true)
                        .then(() => {
                          this.setState({
                            popout: (
                              <PopoutWrapper
                                className={getClassName("ScreenSpinner")}
                                hasMask={false}
                                v="center"
                                h="center"
                                style={{ animation: "fadeout 1s forwards" }}
                              >
                                <div className="ScreenSpinner__container Spinner">
                                  <img src={Icon44Done} alt="Done" />
                                </div>
                              </PopoutWrapper>
                            )
                          });
                          setTimeout(() => {
                            this.setState({ popout: null });
                          }, 1000);
                        })
                        .catch(() => {
                          this.setState({
                            popout: (
                              <PopoutWrapper
                                className={getClassName("ScreenSpinner")}
                                hasMask={false}
                                v="center"
                                h="center"
                                style={{ animation: "fadeout 1s forwards" }}
                              >
                                <div className="ScreenSpinner__container Spinner">
                                  <img src={Icon44Cancel} alt="Cancel" />
                                </div>
                              </PopoutWrapper>
                            )
                          });
                          setTimeout(() => {
                            this.setState({ popout: null });
                          }, 1000);
                        });
                    });
              })
          )
      );
  }

  toggleContext = () => {
    this.setState({ contextOpened: !this.state.contextOpened });
  };

  select = e => {
    const choosedTop = e.currentTarget.dataset.top;

    this.setState({ top: choosedTop });
    if (choosedTop === "Топ Станкина") {
      this.loadTop();
      window.scrollTo(0, 0);
    } else {
      this.loadTopStgroup();
      window.scrollTo(0, 0);
    }

    requestAnimationFrame(this.toggleContext);
  };

  render() {
    const { id } = this.props;
    const { topCells, isLoading, top, popout } = this.state;

    let cellsRend = <Spinner size="medium" style={{ marginTop: 20 }} />;
    if (!isLoading) {
      if (topCells.length) cellsRend = topCells;
      else
        cellsRend = (
          <Div
            style={{
              textAlign: "center",
              color: "var(--text_primary)"
            }}
          >
            Здесь пока пусто...
          </Div>
        );
    }

    if (DataManager.top.length === 0)
      cellsRend = !DataManager.top_notify ? (
        <Div style={{ textAlign: "center", color: "var(--text_primary)" }}>
          Включите уведомления, чтобы узнать о появлении топа!
        </Div>
      ) : (
        <Div style={{ textAlign: "center", color: "var(--text_primary)" }}>
          Мы сообщим, когда появится топ!
        </Div>
      );

    return (
      <View id={id} popout={popout} activePanel="topPanel">
        <Panel id="topPanel" centered={topCells.length > 0 ? false : true}>
          <PanelHeader>
            <PanelHeaderContent
              aside={<Icon16Dropdown />}
              onClick={this.toggleContext}
            >
              {top}
            </PanelHeaderContent>
          </PanelHeader>
          <HeaderContext
            opened={this.state.contextOpened}
            onClose={this.toggleContext}
          >
            <List>
              <Cell
                asideContent={
                  top === "Топ Станкина" ? (
                    <Icon24Done fill="var(--accent)" />
                  ) : null
                }
                onClick={this.select}
                data-top="Топ Станкина"
              >
                Топ Станкина
              </Cell>
              <Cell
                asideContent={
                  top === `Топ ${DataManager.stgroup}` ? (
                    <Icon24Done fill="var(--accent)" />
                  ) : null
                }
                onClick={this.select}
                data-top={`Топ ${DataManager.stgroup}`}
              >
                Топ {`${DataManager.stgroup}`}
              </Cell>
            </List>
          </HeaderContext>
          <div
            style={DataManager.top.length > 0 ? { paddingBottom: 100 } : null}
          >
            {cellsRend}
          </div>
        </Panel>
      </View>
    );
  }
}

export default TopView;
