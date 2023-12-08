import React, { useEffect, useState } from "react";
import {
  View,
  Panel,
  PanelHeader,
  List,
  ModalRoot,
  SimpleCell,
  Banner,
  Button,
  Snackbar,
  Link,
  Div,
  ConfigProvider,
} from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import {
  setBurgerPanel,
  setBurgerModal,
  setSearchTeacher,
  notify,
} from "../redux/actions";
import bridge from "@vkontakte/vk-bridge";
import { api } from "../services";
import Profile from "../panels/Profile";
import TeachersPanel from "../panels/TeachersPanel";
import CommentsPage from "../cells/CommentsPage";
import WriteCommentCard from "../cells/WriteCommentCard";
import ReactionsCard from "../cells/ReactionsCard";
import Lottie from "lottie-react";
import gearsAnimation from "../assets/gears.json";
import { setStory, setView } from "../redux/actions";

import Icon20Info from "@vkontakte/icons/dist/20/info";
import Icon24UserAdd from "@vkontakte/icons/dist/24/user_add";
import { Icon28User } from "@vkontakte/icons";
import Icon28NotificationCircleFillGray from "@vkontakte/icons/dist/28/notification_circle_fill_gray";
import TopView from "./TopView";
import Icon24Education from "@vkontakte/icons/dist/24/education";
import telegram from "../img/telegram.png";
import { Icon20Users3 } from "@vkontakte/icons";
import { useStudentsControllerGetMeQuery } from "../api/slices/students.slice";

const BurgerView = ({ id }) => {
  const activePanel = useSelector((state) => state.burger.activePanel);
  const activeModal = useSelector((state) => state.burger.activeModal);
  const student = useSelector((state) => state.init.student);
  const popout = useSelector((state) => state.burger.popout);
  const [snackbar, setSnackbar] = useState(null);
  const dispatch = useDispatch();
  const [additional, setAdditional] = useState(null);
  const { data: me } = useStudentsControllerGetMeQuery();
  const [history, setHistory] = useState(["main"]);

  useEffect(() => {
    updateAdditional();

    const hash = window.location.hash.slice(1);
    let burgerPanel = "main";
    let teacherName = "";

    if (hash.includes("teachers")) {
      burgerPanel = "teachers";
      dispatch(setBurgerPanel(burgerPanel));
      setHistory(["main", "teachers"]);

      if (hash.match(/\?.*/) && hash.match(/\?.*/)[0].slice(1)) {
        teacherName = decodeURI(hash.match(/\?.*/)[0].slice(1));
        dispatch(setSearchTeacher(teacherName));
      }
    }
  }, []);

  const updateAdditional = () => {
    api.get(`/additional`).then((resp) => {
      setAdditional(resp.data);
    });
  };

  const modal = (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => {
        dispatch(setBurgerModal(null));
      }}
    >
      <CommentsPage id="comments" dynamicContentHeight />
      <WriteCommentCard id="text" />
      <ReactionsCard id="reactions" />
    </ModalRoot>
  );

  const goBack = () => {
    const newHistory = [...history];
    newHistory.pop();
    const newActivePanel = newHistory[newHistory.length - 1];
    if (newActivePanel === "main") {
      bridge.send("VKWebAppDisableSwipeBack");
    }
    setHistory(newHistory);
    dispatch(setBurgerPanel(newActivePanel));
  };

  const goForward = (activePanel) => {
    const newHistory = [...history];
    newHistory.push(activePanel);
    if (activePanel === "main") {
      bridge.send("VKWebAppEnableSwipeBack");
    }
    setHistory(newHistory);
    dispatch(setBurgerPanel(activePanel));
  };

  return (
    <ConfigProvider isWebView>
      <View
        id={id}
        activePanel={activePanel}
        popout={popout}
        modal={modal}
        history={history}
        onSwipeBack={goBack}
      >
        <Panel id="main">
          <PanelHeader>Меню</PanelHeader>
          <List>
            <SimpleCell
              expandable
              before={<Icon28User />}
              onClick={() => {
                goForward("profile");
              }}
              disabled={!me}
            >
              Профиль
            </SimpleCell>
            <SimpleCell
              expandable
              before={<Icon20Users3 width={28} height={28} />}
              onClick={() => {
                goForward("teachers");
              }}
            >
              Преподаватели
            </SimpleCell>

            <SimpleCell
              expandable
              before={<Icon24Education width={28} height={28} />}
              onClick={() => {
                goForward("top");
              }}
              disabled={!me}
            >
              Студенты
            </SimpleCell>

            <Banner
              before={
                <img
                  src={telegram}
                  style={{
                    height: 64,
                  }}
                />
              }
              text="Подписывайтесь на наш телеграм канал"
              actions={
                <React.Fragment>
                  <Button mode="secondary">
                    <Link href="https://t.me/stankinmoduli" target="_blank">
                      Перейти
                    </Link>
                  </Button>
                </React.Fragment>
              }
            />

            {student.hasOwnProperty("student") && (
              <Div>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--content_tint_background)",
                    boxShadow: "0 0 8px rgba(0, 0, 0, 0.15)",
                    borderRadius: 8,
                    border: "1px solid var(--image_border)",
                    maxWidth: 600,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      marginBottom: 8,
                      color: "var(--text_primary)",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    Участвуйте в тестировании приложения и влияйте на его
                    развитие
                  </div>
                  <div
                    style={{
                      width: 64,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      filter: "var(--gears)",
                    }}
                  >
                    <Lottie animationData={gearsAnimation} loop={true} />
                  </div>
                  <Link href="https://bit.ly/stankintesting" target="_blank">
                    Перейти
                  </Link>
                </div>
              </Div>
            )}
            {student.hasOwnProperty("student") && !student.notify && (
              <Banner
                before={
                  <Icon28NotificationCircleFillGray width={48} height={48} />
                }
                text="Хотите получать уведомления о модулях? Мы пришлем их сообщением от сообщества!"
                actions={
                  <React.Fragment>
                    <Button
                      onClick={async () => {
                        const drPr = await bridge.send(
                          "VKWebAppAllowMessagesFromGroup",
                          {
                            group_id: 183639424,
                            key: "dBuBKe1kFcdemzB",
                          }
                        );

                        if (drPr.result === true) {
                          dispatch(notify());
                          setSnackbar(
                            <Snackbar
                              before={<Icon20Info width={48} height={48} />}
                              layout="vertical"
                              onClose={() => setSnackbar(null)}
                            >
                              Уведомления о модулях включены!
                            </Snackbar>
                          );
                        }
                      }}
                    >
                      Хочу!
                    </Button>
                  </React.Fragment>
                }
              />
            )}
            {additional && !additional.isMemberGroup && (
              <Banner
                before={<Icon24UserAdd width={48} height={48} />}
                text="Будьте в курсе всех событий! Будьте с нами!"
                actions={
                  <React.Fragment>
                    <Button
                      onClick={async () => {
                        const result = await bridge.send("VKWebAppJoinGroup", {
                          group_id: 183639424,
                        });

                        if (result && result.result === true)
                          setSnackbar(
                            <Snackbar
                              before={<Icon24UserAdd width={20} />}
                              layout="vertical"
                              onClose={() => setSnackbar(null)}
                            >
                              Вы подписались на группу!
                            </Snackbar>
                          );
                      }}
                    >
                      Подписаться
                    </Button>
                  </React.Fragment>
                }
              />
            )}
          </List>
          {snackbar}
        </Panel>
        <TeachersPanel
          id="teachers"
          onCancelClick={() => {
            goBack();
          }}
        />
        <Profile
          id="profile"
          onBack={() => {
            goBack();
          }}
          onEnter={() => {
            dispatch(setView("loginView"));
            dispatch(setStory("marksRoot"));
          }}
        />
        <TopView
          id="top"
          onCancelClick={() => {
            goBack();
          }}
        />
      </View>
    </ConfigProvider>
  );
};

export default BurgerView;
