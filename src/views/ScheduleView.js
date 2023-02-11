import React, { useState, useEffect } from "react";
import {
  View,
  Panel,
  PanelHeader,
  PanelSpinner,
  PanelHeaderButton,
  Placeholder,
  PanelHeaderBack,
  FixedLayout,
  Link,
  ScreenSpinner,
  Div,
} from "@vkontakte/vkui";
import { useSelector } from "react-redux";
import Icon28Settings from "@vkontakte/icons/dist/28/settings";
import Icon28ArticleOutline from "@vkontakte/icons/dist/28/article_outline";
import ScheduleTableWeek from "../services/ScheduleTableWeek";
import { api } from "../services";
import ScheduleSettings from "./ScheduleSettings";
import Icon56Users3Outline from "@vkontakte/icons/dist/56/users_3_outline";
import bridge from "@vkontakte/vk-bridge";
import { Document, pdfjs, Page } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ScheduleView = ({ id }) => {
  const date = new Date();
  const stgroup = useSelector((state) => state.schedule.stgroup);
  const group = useSelector((state) => state.schedule.group);
  const isFetching = useSelector((state) => state.schedule.isFetching);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonsWeek, setLessonsWeek] = useState([]);
  const [file, setFile] = useState(null);
  const [activePanel, setActivePanel] = useState("main");
  const [activeModal, setActiveModal] = useState(null);

  const load = async () => {
    setIsLoading(true);
    let lessonsWeek = [];

    if (stgroup.length > 0 && group.length > 0) {
      for (var i = 0; i < 7; i++) {
        const result = new Date(date);
        result.setDate(result.getDate() + i);
        const parsedDate =
          result.getFullYear() +
          "-" +
          parseInt(result.getMonth() + 1) +
          "-" +
          result.getDate();

        await api
          .get(
            `/schedule/lessons?stgroup=${stgroup}&group=${group}&day=${parsedDate}`
          )
          .then(({ data }) => {
            lessonsWeek = lessonsWeek.concat([data]);
          });
      }

      setLessonsWeek(lessonsWeek);
    }
    if (stgroup.length > 0 && group.length === 0) {
      setActiveModal("select");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (activePanel === "pdf")
      api.get(`/schedule/file?stgroup=${stgroup}`).then(({ data }) => {
        var pdf = `data:application/pdf;base64,${data}`;

        setFile(pdf);
      });
  }, [activePanel]);

  useEffect(() => {
    load();
  }, [isFetching]);

  const onHeaderButtonClick = () => {
    setActiveModal("select");
  };

  const modal = (
    <ScheduleSettings
      id="scheduleSettings"
      activeModal={activeModal}
      onSettingsClose={() => {
        setActiveModal(null);
      }}
    />
  );

  const onHeaderScheduleClick = () => {
    setActivePanel("pdf");
  };

  const checkSchedule = () => {
    return (
      <Div style={{ textAlign: "center" }}>
        <span>Сверьтесь с</span>{" "}
        <span
          style={{
            color: "var(--accent)",
          }}
          onClick={() => {
            setActivePanel("pdf");
          }}
        >
          оригиналом
        </span>
        .<br />
        <Link href="https://vk.com/im?sel=-183639424" target="_blank">
          Сообщите
        </Link>
        <span> об ошибке.</span>
      </Div>
    );
  };

  const tabbarHeight = parseInt(
    window.getComputedStyle(document.body).getPropertyValue("--tabbar_height")
  );

  return (
    <View id={id} activePanel={activePanel} modal={modal}>
      <Panel id="main">
        <PanelHeader
          left={
            <React.Fragment>
              <PanelHeaderButton onClick={onHeaderButtonClick}>
                <Icon28Settings />
              </PanelHeaderButton>{" "}
              <PanelHeaderButton onClick={onHeaderScheduleClick}>
                <Icon28ArticleOutline />
              </PanelHeaderButton>
            </React.Fragment>
          }
          separator={false}
        >
          Расписание
        </PanelHeader>

        {!isLoading ? (
          !stgroup || !group ? (
            <Placeholder
              header="Группа не выбрана"
              icon={<Icon56Users3Outline />}
              stretched
            />
          ) : (
            <ScheduleTableWeek
              lessonsWeek={lessonsWeek}
              //check schedule
              before={null}
            />
          )
        ) : (
          <PanelSpinner size="large" />
        )}
      </Panel>
      <Panel id="pdf" centered separator={false}>
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderBack
              onClick={() => {
                setActivePanel("main");
              }}
            />
          }
        >
          Расписание
        </PanelHeader>

        {file && (
          <div
            style={{
              paddingBottom: "var(--tabbar_height)",
            }}
          >
            <TransformWrapper options={{ limitToBounds: false }}>
              <TransformComponent>
                <Document
                  loading={<ScreenSpinner size="large" />}
                  options={{
                    cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                    cMapPacked: true,
                  }}
                  file={file}
                >
                  <Page
                    loading={<ScreenSpinner size="large" />}
                    pageNumber={1}
                    renderAnnotationLayer={false}
                  />
                </Document>{" "}
              </TransformComponent>
            </TransformWrapper>
          </div>
        )}

        {file && (
          <FixedLayout vertical="bottom" filled>
            <Div style={{ textAlign: "center" }}>
              <Link href={file} download>
                Скачать
              </Link>
            </Div>
          </FixedLayout>
        )}
      </Panel>
    </View>
  );
};

export default ScheduleView;
