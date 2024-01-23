import { useEffect } from "react";
import { Epic, View, Root, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { api } from "./services";

import "@vkontakte/vkui/dist/vkui.css";
import "./app.css";
import {
  Icon28CalendarOutline,
  Icon20EducationOutline,
  Icon28Menu,
} from "@vkontakte/icons";

import Login from "./panels/Login";
import Marks from "./panels/Marks";
import ScheduleView from "./views/ScheduleView";
import StgroupsView from "./views/StgroupsView";
import GroupsView from "./views/GroupsView";
import BurgerView from "./views/BurgerView";
import { useAppDispatch, useAppSelector } from "./api/store";
import { setStory, setView } from "./api/slices/config.slice";
import {
  setGroup,
  setGroupAndStgroup,
  setIsFetching,
  setStgroup,
} from "./api/slices/schedule.slice";
import { useStudentsControllerGetMeQuery } from "./api/slices/students.slice";

export function App() {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.config.activeView);
  const activeStory = useAppSelector((state) => state.config.activeStory);
  const { data: me } = useStudentsControllerGetMeQuery();

  const onStoryChange = (e: any) => {
    const story = e.currentTarget.dataset.story;

    changeStory(story);
  };

  const changeStory = (story: string) => {
    switch (story) {
      case "marksRoot":
        if (!me) dispatch(setView("loginView"));
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

  async function loadSchedule() {
    dispatch(setIsFetching(true));
    await api
      .get(`/schedule/favourite`)
      .then(
        async ({
          data,
        }: {
          data: { _id: string; id: string; group: string; stgroup: string };
        }) => {
          dispatch(
            setGroupAndStgroup({
              group: data.group,
              stgroup: data.stgroup,
            })
          );
        }
      );
    dispatch(setIsFetching(false));
  }

  const onAppLoad = async () => {
    await loadSchedule();
    // dispatch(fetchInit());
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
  }, [me]);

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
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "burgerView"}
            data-story="burgerView"
          >
            <Icon28Menu />
          </TabbarItem>
        </Tabbar>
      }
    >
      <Root id="marksRoot" activeView={activeView}>
        <Login id="loginView" />
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
                  // await dispatch(loadSchedule());
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

            // await dispatch(loadSchedule());
            dispatch(setView("scheduleView"));
          }}
        />
      </Root>

      <BurgerView id="burgerView" />
    </Epic>
  );
}
