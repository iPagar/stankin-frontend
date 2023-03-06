import React, { useEffect } from "react";
import { Epic, View, Root, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { useDispatch, useSelector } from "react-redux";
import {
  setStory,
  loadSchedule,
  setView,
  setStgroup,
  fetchInit,
  setBurgerPanel,
} from "./redux/actions";
import { api } from "./services";

import "@vkontakte/vkui/dist/vkui.css";
import "./app.css";

import Icon28CalendarOutline from "@vkontakte/icons/dist/28/calendar_outline";
import Icon20EducationOutline from "@vkontakte/icons/dist/20/education_outline";
import Icon28Menu from "@vkontakte/icons/dist/28/menu";

import Login from "./panels/Login";
import Marks from "./panels/Marks";
import ScheduleView from "./views/ScheduleView";
import StgroupsView from "./views/StgroupsView";
import GroupsView from "./views/GroupsView";
import BurgerView from "./views/BurgerView";

const App = () => {
  const dispatch = useDispatch();
  const activeView = useSelector((state) => state.config.activeView);
  const activeStory = useSelector((state) => state.config.activeStory);
  const student = useSelector((state) => state.init.student);

  const onStoryChange = (e) => {
    const story = e.currentTarget.dataset.story;

    changeStory(story);
  };

  const changeStory = (story) => {
    switch (story) {
      case "marksRoot":
        if (!student.hasOwnProperty("student")) dispatch(setView("loginView"));
        else dispatch(setView("mainView"));
        dispatch(setStory(story));
        break;
      case "scheduleRoot":
        dispatch(setView("scheduleView"));
        dispatch(setStory(story));
        break;
      case "burgerView":
        dispatch(setStory(story));
        break;
      case "topView":
        dispatch(setStory(story));
        break;
      default:
        break;
    }
  };
  const onAppLoad = () => {
    dispatch(loadSchedule());
    dispatch(fetchInit());
  };

  useEffect(() => {
    onAppLoad();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    let story = activeStory ? activeStory : "scheduleRoot";

    if (hash.includes("marks")) {
      story = "marksRoot";
    } else if (hash.includes("teachers")) {
      story = "burgerView";
    }
    changeStory(story);
  }, [student.hasOwnProperty("student")]);

  const withTeachers = true;

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        <Tabbar>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "scheduleRoot"}
            data-story="scheduleRoot"
          >
            <Icon28CalendarOutline />
          </TabbarItem>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "marksRoot"}
            data-story="marksRoot"
          >
            <Icon20EducationOutline width={28} height={28} />
          </TabbarItem>
          {withTeachers && (
            <TabbarItem
              onClick={onStoryChange}
              selected={activeStory === "burgerView"}
              data-story="burgerView"
            >
              <Icon28Menu />
            </TabbarItem>
          )}
        </Tabbar>
      }
    >
      <Root id="marksRoot" activeView={activeView}>
        <View id="loginView" activePanel="login" header={false}>
          <Login id="login" />
        </View>
        <View id="mainView" activePanel="marks" header={false}>
          <Marks id="marks" />
        </View>
      </Root>

      <Root id="scheduleRoot" activeView={activeView}>
        <ScheduleView id="scheduleView" />
        <StgroupsView
          id="stgroupsView"
          onBack={() => {
            dispatch(setView("scheduleView"));
          }}
          onCellClick={async (e) => {
            const stgroup = e.currentTarget.dataset.stgroup;
            await api
              .get(`/schedule/groups?stgroup=${stgroup}`)
              .then(async ({ data }) => {
                if (data.length === 1) {
                  await api.put(`/schedule/favourite`, {
                    stgroup: stgroup,
                    group: data[0],
                  });
                  await dispatch(loadSchedule());
                  dispatch(setView("scheduleView"));
                } else {
                  await dispatch(setStgroup(stgroup));
                  dispatch(setView("groupsView"));
                }
              });
          }}
        />
        <GroupsView
          id="groupsView"
          onBack={() => {
            dispatch(setView("scheduleView"));
          }}
          onCellClick={async (e) => {
            const group = e.currentTarget.dataset.group;
            const stgroup = e.currentTarget.dataset.stgroup;

            await api.put(`/schedule/favourite`, {
              stgroup,
              group,
            });

            await dispatch(loadSchedule());
            dispatch(setView("scheduleView"));
          }}
        />
      </Root>

      <BurgerView id="burgerView" />
    </Epic>
  );
};

export default App;
