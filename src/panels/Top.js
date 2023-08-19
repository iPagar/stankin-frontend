import React from "react";
import {
  List,
  FixedLayout,
  Tabs,
  TabsItem,
  UsersStack,
  Spinner,
  Search,
  PanelHeaderContext,
  Placeholder,
  PanelHeaderContent,
  Cell,
  PanelHeaderSimple,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import { api } from "../services";
import { setActiveBottomTab } from "../redux/actions";
import vkc from "@vkontakte/vk-bridge";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";

import TopCell from "./TopCell";
import Empty from "./Empty";
import { Portal } from "@material-ui/core";

const mapStateToProps = (state) => {
  return {
    student: state.init.student,
    semesters: [
      // if month > 7, then current year is active
      ...new Array(
        new Date().getMonth() > 6
          ? new Date().getFullYear() - 2015
          : new Date().getFullYear() - 2016
      )
        .fill(null)
        .map((_, i) => `${2016 + i}-весна`)
        .filter((semester) => {
          return semester !== "2016-весна";
        }),
      ...new Array(
        new Date().getMonth() > 7
          ? new Date().getFullYear() - 2015
          : new Date().getFullYear() - 2016
      )
        .fill(null)
        .map((_, i) => `${2016 + i}-осень`),
    ]
      .sort(
        (a, b) =>
          new Date(b.slice(0, 4), b.slice(5, 10) === "осень" ? 8 : 2) -
          new Date(a.slice(0, 4), a.slice(5, 10) === "осень" ? 8 : 2)
      )
      .reverse(),
    activeBottomTab: state.config.activeBottomTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

class Top extends React.Component {
  state = {
    isFetching: true,
    top: [],
    isTop: true,
    hasMore: true,
    pageStart: 0,
    offset: 0,
    me: null,
    search: "",
    selectedSemester: this.props.semesters[this.props.semesters.length - 1],
    activeBottomTab: "rating",
  };

  selectBottomTab = (e) => {
    const tag = e.currentTarget.dataset.tag;

    this.setState({
      activeBottomTab: tag,
    });
  };

  componentDidUpdate(_prevProps, prevState) {
    if (
      this.state.selectedSemester !== prevState.selectedSemester ||
      this.state.activeBottomTab !== prevState.activeBottomTab
    ) {
      this.setState({
        search: "",
        pageStart: 0,
        hasMore: true,
        me: null,
        top: [],
        isFetching: true,
        isTop: true,
        selectedSemester: this.state.selectedSemester,
        activeBottomTab: this.state.activeBottomTab,
      });
    }
  }

  semesterFormat = (semester) => {
    return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
  };

  select = (e) => {
    const tag = e.currentTarget.dataset.tag;

    this.setState({
      selectedSemester: tag,
    });

    window.scrollTo(0, 0);
    requestAnimationFrame(this.toggleContext);
  };

  renderPanelHeaderContext() {
    const { selectedSemester } = this.state;
    const { semesters } = this.props;

    return (
      <PanelHeaderContext
        opened={this.state.contextOpened}
        onClose={this.toggleContext}
      >
        <Portal>
          <div
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
              position: "fixed",
              background: "var(--header_background)",
              zIndex: 9999,
              width: "100%",
              top: "var(--safe-area-inset-top)",
              overscrollBehavior: "contain",
              marginBottom: "var(--tabbar_height)",
              marginTop: 56,
              bottom: 0,
            }}
          >
            <List
              style={{
                overflow: "scroll",
              }}
            >
              {semesters.map((semester, i) => (
                <Cell
                  key={i}
                  data-tag={semester}
                  asideContent={
                    selectedSemester === semester ? (
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
        </Portal>
      </PanelHeaderContext>
    );
  }

  onSearchChange = (search) => {
    this.setState({
      search: search.target.value,
      top: [],
      me: null,
      pageStart: 0,
      hasMore: true,
      isFetching: true,
    });
  };

  myComponent = () => {
    const {
      search,
      isTop,
      pageStart,
      hasMore,
      top,
      me,
      isFetching,
      activeBottomTab,
    } = this.state;

    return (
      <div>
        <div
          style={{
            position: "sticky",
            top: activeBottomTab === "rating" ? 48 : 0,
            background: "var(--header_alternate_background)",
            zIndex: 3,
          }}
        >
          {activeBottomTab === "rating" &&
            (top.length > 0 || search.length > 0) && (
              <Search
                placeholder={"Введите фамилию или группу"}
                value={search}
                onChange={this.onSearchChange}
              />
            )}
        </div>
        <div style={{ marginBottom: me ? 48 * 2 : 48 }}>
          {isTop ? (
            (!isFetching && !top.length && search && (
              <Placeholder>не найдено</Placeholder>
            )) || (
              <InfiniteScroll
                pageStart={pageStart}
                loadMore={this.loadTop}
                hasMore={hasMore}
                loader={<Spinner size={"large"} key={0} />}
              >
                <List>
                  {top.map((student) => (
                    <TopCell key={student.id} {...student} />
                  ))}
                </List>
              </InfiniteScroll>
            )
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  };

  toggleContext = () => {
    // set body not scroll
    document.body.style.overflow = !this.state.contextOpened ? "hidden" : "";
    this.setState({ contextOpened: !this.state.contextOpened });
  };

  async fetchMe() {
    const { semesters } = this.props;
    const { selectedSemester, activeBottomTab } = this.state;

    const userInfo = await vkc.send("VKWebAppGetUserInfo", {});
    const rating = await api.post(
      activeBottomTab === "rating" ? `/rating` : `/ratingst`,
      {
        semester: semesters.find((semester) => semester === selectedSemester),
        search: userInfo.id,
      }
    );
    if (rating.data.find((student) => student.id === userInfo.id) === undefined)
      return null;
    return {
      ...rating.data.find((student_1) => student_1.id === userInfo.id),
      ...userInfo,
    };
  }

  loadTop = async () => {
    const { pageStart, search, selectedSemester, activeBottomTab } = this.state;

    try {
      const auth = await vkc.send("VKWebAppGetAuthToken", {
        app_id: 7010368,
        scope: "",
      });
      const resp = await api.post(`/${activeBottomTab}`, {
        semester: selectedSemester,
        search,
        offset: pageStart,
      });
      const resp_1 = {
        students: resp.data,
        auth,
      };
      const users = await vkc.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        request_id: 1,
        params: {
          user_ids: resp_1.students.map((student) => student.id).toString(),
          fields: "photo_50",
          v: "5.103",
          access_token: resp_1.auth.access_token,
        },
      });
      const resp_2 = {
        students: resp_1.students,
        users: users.response,
      };
      const top = !pageStart
        ? resp_2.users.map((user, i) => ({
            ...user,
            ...resp_2.students[i],
          }))
        : [
            ...this.state.top,
            ...resp_2.users.map((user_1, i_1) => ({
              ...user_1,
              ...resp_2.students[i_1],
            })),
          ];
      const resp_3 = top;
      const me = await this.fetchMe();
      if (pageStart === 0 && resp_3.length && !search) {
        this.setState((state_1) => ({
          me: me,
          isTop: true,
          top: resp_3,
          hasMore: !(resp_3.length % 10),
          pageStart: state_1.pageStart + 1,
          isFetching: false,
        }));
      } else if (pageStart === 0 && !resp_3.length && !search)
        this.setState((state_2) => ({
          isTop: false,
        }));
      else
        this.setState((state_3) => ({
          me: me,
          isTop: true,
          top: resp_3,
          isFetching: false,
          hasMore: !(resp_3.length % 10),
          pageStart: state_3.pageStart + 1,
        }));
    } catch (error) {
      this.setState({ top: [] });
    }
  };

  renderMe() {
    const { me } = this.state;

    return (
      <UsersStack
        style={{
          position: "fixed",
          bottom: "calc(48px + var(--tabbar_height))",
          zIndex: 3,
          background: "var(--background_content)",
          width: "100%",
        }}
        photos={[me.photo_100]}
      >
        {`Вы на ${me.number} месте`}
      </UsersStack>
    );
  }

  render() {
    const { me, selectedSemester, activeBottomTab } = this.state;
    const { student } = this.props;

    return (
      <>
        <PanelHeaderSimple
          separator={false}
          left={<PanelHeaderBack onClick={this.props.onCancelClick} />}
        >
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
            {this.semesterFormat(selectedSemester)}
          </PanelHeaderContent>
        </PanelHeaderSimple>
        {this.renderPanelHeaderContext()}

        <div
          style={{
            width: "100%",
            isolation: "isolate",
          }}
        >
          {this.myComponent()}

          {Object.keys(this.props.student).length > 0 && (
            <FixedLayout vertical="bottom">
              {me && this.renderMe()}
              <Tabs>
                <TabsItem
                  data-tag={"rating"}
                  onClick={this.selectBottomTab}
                  selected={activeBottomTab === "rating"}
                >
                  Станкин
                </TabsItem>

                <TabsItem
                  data-tag={"ratingst"}
                  onClick={this.selectBottomTab}
                  selected={activeBottomTab === "ratingst"}
                >
                  {`${student.stgroup}`}
                </TabsItem>
              </Tabs>
            </FixedLayout>
          )}
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Top);
