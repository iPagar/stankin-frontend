import React from "react";
import {
  View,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  HeaderContext,
  List,
  Cell,
  HeaderButton,
  platform,
  IOS,
  ActionSheet,
  ActionSheetItem,
  PullToRefresh,
  FixedLayout,
  Tabs,
  HorizontalScroll,
  TabsItem,
  Spinner,
  Div,
  Search,
  Group,
  UsersStack,
  Placeholder
} from "@vkontakte/vkui";
import ScreenSpinnerPromise from "vkui-screen-spinner-promise";
import connect from "@vkontakte/vk-connect";
import axios from "../services/axios";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import MarksTable from "../services/MarksTable";
import Icon24MoreHorizontal from "@vkontakte/icons/dist/24/more_horizontal";
import "./Login.css";
import TopCell from "../services/TopCell";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

import Icon56HistoryOutline from "@vkontakte/icons/dist/56/history_outline";
import Icon28CancelCircleOutline from "@vkontakte/icons/dist/28/cancel_circle_outline";

const api = new VKMiniAppAPI();

const osname = platform();
let is_classic = false;

class Marks extends React.Component {
  state = {
    popout: null,
    contextOpened: false,
    activeTab: "marks",
    isLoading: true,
    isFetching: false,
    activeTabTop: "topStankina",
    top: [],
    sttop: [],
    search: "",
    offset: 0,
    rate: 0,
    photo: ""
  };

  renderEmpty() {
    return (
      <Placeholder icon={<Icon56HistoryOutline />} stretched>
        Здесь пока что пусто
      </Placeholder>
    );
  }

  toggleContext = () => {
    this.setState({ contextOpened: !this.state.contextOpened });
  };

  renderError() {
    return (
      <Placeholder
        icon={<Icon28CancelCircleOutline width={56} height={56} />}
        stretched
      >
        Ошибка
      </Placeholder>
    );
  }

  errorHandler = () => {
    const errorDiv = this.renderError();
    this.setState({
      top: errorDiv,
      sttop: errorDiv,
      marks: errorDiv,
      error: errorDiv
    });
  };

  select = e => {
    const { semesters } = this.state;
    const choosedSemester = JSON.parse(e.currentTarget.dataset.semester);

    this.setState({ semester: choosedSemester, offset: 0, search: "" }, () => {
      window.removeEventListener("scroll", this.checkBottomLine);

      semesters.forEach((semester, i) => {
        if (JSON.stringify(semester) === JSON.stringify(choosedSemester)) {
          this.setState({ isLoading: true });
          this.updateMarks(semester)
            .then(() => {
              this.fetchTop().then(() => {
                this.setState({ isLoading: false });
              });
            })
            .catch(resp => {
              this.errorHandler();
              this.setState({ isLoading: false });
            });
        }
      });
      requestAnimationFrame(this.toggleContext);
    });
  };

  onStoryChange = e => {
    this.setState({ activeStory: e.currentTarget.dataset.story });
  };

  openSheet = () => {
    const { student } = this.props;
    this.setState({
      popout: (
        <ActionSheet onClose={() => this.setState({ popout: null })}>
          {(student.issubscribed && (
            <ActionSheetItem
              onClick={() =>
                this.setState({
                  popout: (
                    <ScreenSpinnerPromise
                      onStart={() =>
                        axios
                          .post("/notify", { notify: false })
                          .then(() =>
                            axios
                              .post("/student")
                              .then(response =>
                                this.props.go("marks", response.data[0])
                              )
                          )
                      }
                      onCancel={() =>
                        this.setState({
                          popout: null
                        })
                      }
                      onDone={() => this.setState({ popout: null })}
                    />
                  )
                })
              }
            >
              Не уведомлять об оценках
            </ActionSheetItem>
          )) || (
            <ActionSheetItem
              onClick={() =>
                this.setState({
                  popout: (
                    <ScreenSpinnerPromise
                      onStart={() =>
                        connect
                          .sendPromise("VKWebAppAllowMessagesFromGroup", {
                            group_id: 183639424,
                            key: "dBuBKe1kFcdemzB"
                          })
                          .then(resp =>
                            axios
                              .post("/notify", { notify: true })
                              .then(() =>
                                axios
                                  .post("/student")
                                  .then(response =>
                                    this.props.go("marks", response.data[0])
                                  )
                              )
                          )
                      }
                      onCancel={() =>
                        this.setState({
                          popout: null
                        })
                      }
                      onDone={() => this.setState({ popout: null })}
                    />
                  )
                })
              }
            >
              Уведомлять об оценках
            </ActionSheetItem>
          )}
          {!student.is_classic ? (
            <ActionSheetItem
              onClick={() => {
                this.setState({
                  popout: (
                    <ScreenSpinnerPromise
                      onStart={() =>
                        axios
                          .post("/classic", { is_classic: true })
                          .then(() => {
                            axios
                              .post("/student")
                              .then(response =>
                                this.props.go("marks", response.data[0])
                              );
                          })
                      }
                      onCancel={() =>
                        this.setState({
                          popout: null
                        })
                      }
                      onDone={() => {
                        is_classic = true;
                        this.setState({ popout: null });
                      }}
                    />
                  )
                });
              }}
            >
              Включить табличное оформление
            </ActionSheetItem>
          ) : (
            <ActionSheetItem
              onClick={() => {
                this.setState({
                  popout: (
                    <ScreenSpinnerPromise
                      onStart={() =>
                        axios
                          .post("/classic", { is_classic: false })
                          .then(() => {
                            axios
                              .post("/student")
                              .then(response =>
                                this.props.go("marks", response.data[0])
                              );
                          })
                      }
                      onCancel={() =>
                        this.setState({
                          popout: null
                        })
                      }
                      onDone={() => {
                        is_classic = false;
                        this.setState({ popout: null });
                      }}
                    />
                  )
                });
              }}
            >
              Выключить табличное оформление
            </ActionSheetItem>
          )}
          <ActionSheetItem
            theme="destructive"
            onClick={() => {
              this.setState({
                popout: (
                  <ScreenSpinnerPromise
                    onStart={() => axios.post("/delete")}
                    onCancel={() =>
                      this.setState({
                        popout: null
                      })
                    }
                    onDone={() => {
                      this.setState({ popout: null });
                      this.props.go("login");
                    }}
                  />
                )
              });
            }}
          >
            Выйти
          </ActionSheetItem>

          {osname === IOS && (
            <ActionSheetItem autoclose theme="cancel">
              Отменить
            </ActionSheetItem>
          )}
        </ActionSheet>
      )
    });
  };

  updateSemesters = () => {
    return axios.post("/semesters").then(semesters => {
      const sortedSemesters = semesters.data.sort((a, b) => {
        if (a.year < b.year) return -1;

        if (a.year > b.year) return 1;

        if (a.year === b.year) if (a.season < b.season) return -1;
        return 0;
      });

      this.setState({ semesters: sortedSemesters });
      return sortedSemesters;
    });
  };

  updateMarks = semester => {
    return axios
      .post("/marks", { year: semester.year, season: semester.season })
      .then(json => {
        json = json.data;
        const sortMarks = [];

        for (const i in json) {
          const subject = json[i].subject;

          if (!sortMarks.some(sortMark => sortMark.subject === subject)) {
            const subjectMarks = { subject: subject };

            json
              .filter(mark => mark.subject === subject)
              .forEach(mark => (subjectMarks[`${mark.module}`] = mark.mark));
            sortMarks.push(subjectMarks);
          }
        }

        sortMarks.sort(function compare(a, b) {
          if (a.subject < b.subject) {
            return -1;
          }
          if (a.subject > b.subject) {
            return 1;
          }
          // a должно быть равным b
          return 0;
        });

        this.setState({ marks: sortMarks });
        return sortMarks;
      });
  };

  componentDidMount() {
    if (window.location.hash.slice(1) === "top")
      this.setState({ activeStory: "top" });

    this.setState({ isLoading: true });
    this.updateSemesters()
      .then(sortedSemesters => {
        this.setState({
          semester: sortedSemesters[sortedSemesters.length - 1]
        });
        sortedSemesters.forEach((semester, i) => {
          if (
            JSON.stringify(semester) === JSON.stringify(this.state.semester)
          ) {
            this.updateMarks(semester).then(() => {
              this.fetchTop().then(() => {
                this.setState({ isLoading: false });

                window.scrollTo(0, 0);
              });
            });
          }
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        this.errorHandler();
      });
  }

  checkBottomLine = () => {
    if (
      window.innerHeight -
        document.getElementById("bottomLine").getBoundingClientRect().top >=
      30
    ) {
      this.loadTop().then(top => {
        const newTop = this.state.top.props.children;
        newTop.push(top.props.children);
        this.setState({ top: <List>{newTop}</List> });
      });
      window.removeEventListener("scroll", this.checkBottomLine);
    }
  };

  loadTop = () => {
    const { semester, offset, search } = this.state;

    return axios
      .post("/rate", {
        search,
        year: semester.year,
        season: semester.season,
        offset
      })
      .then(top => {
        top = top.data;
        return api.getAuthToken(7010368).then(auth =>
          api
            .callAPIMethod("users.get", {
              request_id: 1,
              user_ids: top.map(student => student.id).toString(),
              fields: "photo_50",
              v: "5.103",
              access_token: auth.accessToken
            })
            .then(users => {
              const id = this.props.student.id;
              this.setState({ offset: offset + top.length });
              if (this.state.activeTab === "top")
                window.addEventListener("scroll", this.checkBottomLine);

              return (
                <List>
                  {top.map((group, i) => {
                    return (
                      <TopCell
                        key={group.id}
                        itsme={id === group.id}
                        position={group.number}
                        isgroup={true}
                        person={{
                          id: group.id,
                          stgroup: group.stgroup,
                          rating: group.rating
                        }}
                        user={users[i]}
                      />
                    );
                  })}
                </List>
              );
            })
        );
      });
  };

  loadTopStgroup() {
    const { semester } = this.state;

    return axios.post("/stgrouprate", semester).then(top => {
      const topStgroup = top.data;

      return api.getAuthToken(7010368).then(auth =>
        api
          .callAPIMethod("users.get", {
            request_id: 1,
            user_ids: topStgroup.map(student => student.id).toString(),
            fields: "photo_50",
            v: "5.103",
            access_token: auth.accessToken
          })
          .then(users => {
            return (
              <List>
                {topStgroup.map((group, i) => {
                  return (
                    <TopCell
                      key={group.id}
                      position={group.number}
                      person={{
                        id: group.id,
                        rating: group.rating
                      }}
                      user={users[i]}
                    />
                  );
                })}
              </List>
            );
          })
      );
    });
  }

  fetchTop = () => {
    const { semester } = this.state;

    return Promise.all(
      connect.isWebView()
        ? this.setState({
            top: (
              <Div
                style={{ minHeight: window.innerHeight, textAlign: "center" }}
              >
                Раздел отображается только в мобильном браузере.
                <br />
              </Div>
            )
          })
        : [
            this.loadTop().then(top => {
              if (top.props.children.length > 10)
                this.setState({
                  top
                });
              else
                this.setState({
                  top: this.renderEmpty()
                });
            }),
            api.getAuthToken(7010368).then(auth =>
              api
                .callAPIMethod("users.get", {
                  request_id: 1,
                  user_ids: this.props.student.id,
                  fields: "photo_50",
                  v: "5.103",
                  access_token: auth.accessToken
                })
                .then(resp => {
                  this.setState({
                    photo: resp[0].photo_50
                  });
                })
            ),
            axios.post("/ratebyid", semester).then(resp => {
              if (resp.data.rate.length)
                this.setState({
                  rate: resp.data.rate[0].number
                });
              else
                this.setState({
                  rate: 0
                });
            }),
            this.loadTopStgroup().then(sttop => {
              if (sttop.props.children.length > 1)
                this.setState({
                  sttop
                });
              else
                this.setState({
                  sttop: this.renderEmpty()
                });

              window.scrollTo(0, 0);
            })
          ]
    ).catch(err => {
      console.log(err);
      this.setState({
        isLoading: false,
        top: this.renderError()
      });
    });
  };

  onSearchChange = search => {
    let timeout = null;
    clearTimeout(timeout);

    this.setState({ search, offset: 0 }, () => {
      timeout = setTimeout(() => {
        if (search === this.state.search)
          this.loadTop().then(top => {
            if (top.props.children.length)
              this.setState({
                top
              });
            else
              this.setState({
                top: <Placeholder>Не найдено</Placeholder>
              });
          });
      }, 200);
    });
  };

  render() {
    const {
      popout,
      semester,
      semesters,
      marks,
      isLoading,
      isFetching,
      activeTab,
      activeTabTop,
      top,
      sttop,
      error,
      rate,
      photo
    } = this.state;
    const { id, student } = this.props;

    return (
      <View id="marks" activePanel={id} popout={popout}>
        <Panel id={id}>
          <PanelHeader
            left={
              <HeaderButton onClick={this.openSheet}>
                <Icon24MoreHorizontal />
              </HeaderButton>
            }
            noShadow
          >
            <PanelHeaderContent
              aside={<Icon16Dropdown />}
              onClick={this.toggleContext}
            >
              {semester ? `${semester.year} ${semester.season}` : "Семестр"}
            </PanelHeaderContent>
          </PanelHeader>
          <HeaderContext
            opened={this.state.contextOpened}
            onClose={this.toggleContext}
            style={{ marginTop: 48 }}
          >
            <List>
              {semesters
                ? semesters.map((semester, i) => {
                    const semesterCell = (
                      <Cell
                        key={i}
                        asideContent={
                          JSON.stringify(this.state.semester) ===
                          JSON.stringify(semester) ? (
                            <Icon24Done fill="var(--accent)" />
                          ) : null
                        }
                        onClick={this.select}
                        data-semester={JSON.stringify(semester)}
                      >
                        {`${semester.year} ${semester.season}`}
                      </Cell>
                    );
                    return semesterCell;
                  })
                : null}
            </List>
          </HeaderContext>
          <FixedLayout vertical="top">
            <Tabs theme="header" type="buttons">
              <HorizontalScroll>
                <TabsItem
                  onClick={() => {
                    this.setState({ activeTab: "marks" });
                    window.removeEventListener("scroll", this.checkBottomLine);
                    window.scrollTo(0, 0);
                  }}
                  selected={activeTab === "marks"}
                >
                  Оценки
                </TabsItem>
                <TabsItem
                  onClick={() => {
                    this.setState({ activeTab: "top" });
                    window.scrollTo(0, 0);
                  }}
                  selected={activeTab === "top"}
                >
                  Топ
                </TabsItem>
              </HorizontalScroll>
            </Tabs>
          </FixedLayout>

          {activeTab === "marks" && (
            <div style={{ marginTop: 60 }}>
              {isLoading ? (
                <Placeholder stretched>
                  <Spinner size="medium" style={{ marginTop: 20 }} />
                </Placeholder>
              ) : (
                <PullToRefresh
                  onRefresh={() => {
                    this.setState({ isFetching: true });
                    this.updateMarks(semester)
                      .then(() => {
                        this.fetchTop().then(() => {
                          this.setState({ isFetching: false });
                        });
                      })
                      .catch(resp => {
                        this.setState({ isFetching: false });
                        this.errorHandler();
                      });
                  }}
                  isFetching={isFetching}
                >
                  <div>
                    {marks.length > 1 ? (
                      <MarksTable
                        marks={marks}
                        style={{ margin: 0 }}
                        is_classic={
                          this.props.student
                            ? this.props.student.is_classic
                            : false
                        }
                      />
                    ) : (
                      error
                    )}
                  </div>
                </PullToRefresh>
              )}
            </div>
          )}

          {activeTab === "top" && (
            <React.Fragment>
              <div
                style={{
                  marginTop: 48,
                  paddingBottom: 0
                }}
              >
                {isLoading ? (
                  <Placeholder stretched>
                    <Spinner size="large" style={{ marginTop: 20 }} />
                  </Placeholder>
                ) : (
                  <PullToRefresh
                    onRefresh={() => {
                      this.setState({ isFetching: true });
                      this.updateMarks(semester)
                        .then(() => {
                          this.fetchTop().then(() => {
                            this.setState({ isFetching: false });
                          });
                        })
                        .catch(resp => {
                          this.setState({ isFetching: false });
                          this.errorHandler();
                        });
                    }}
                    isFetching={isFetching}
                  >
                    <div
                      style={{
                        paddingBottom: 60
                      }}
                    >
                      <div>
                        {activeTabTop === "topStankina" ? (
                          <div>
                            <Search
                              placeholder={"Введите фамилию или группу"}
                              value={this.state.search}
                              onChange={this.onSearchChange}
                            />
                            {top}

                            {rate > 0 && (
                              <UsersStack
                                style={{
                                  position: "fixed",
                                  bottom: "48px",
                                  zIndex: 3,
                                  background: "var(--background_content)",
                                  width: "100%"
                                }}
                                photos={[photo]}
                              >
                                {`Вы на ${rate} месте`}
                              </UsersStack>
                            )}
                          </div>
                        ) : (
                          sttop
                        )}
                        <div
                          id="bottomLine"
                          style={{
                            paddingBottom: 60
                          }}
                        ></div>
                      </div>
                    </div>
                  </PullToRefresh>
                )}
              </div>
              <FixedLayout vertical="bottom">
                <Tabs>
                  <TabsItem
                    onClick={() => {
                      this.setState({ activeTabTop: "topStankina" });
                    }}
                    selected={activeTabTop === "topStankina"}
                  >
                    Станкин
                  </TabsItem>
                  <TabsItem
                    onClick={() => {
                      this.setState({ activeTabTop: "topStgroup" });
                    }}
                    selected={activeTabTop === "topStgroup"}
                  >
                    {student ? `${student.stgroup}` : `Группа`}
                  </TabsItem>
                </Tabs>
              </FixedLayout>
            </React.Fragment>
          )}
        </Panel>
      </View>
    );
  }
}

export default Marks;
