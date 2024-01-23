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
import {
  Icon28Settings,
  Icon28ArticleOutline,
  Icon56Users3Outline,
} from "@vkontakte/icons";
import ScheduleTableWeek from "../services/ScheduleTableWeek";
import { api } from "../services";
import ScheduleSettings from "./ScheduleSettings";
import bridge from "@vkontakte/vk-bridge";
import { Document, pdfjs, Page } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAppDispatch, useAppSelector } from "../api/store";
import { setIsFetching } from "../api/slices/schedule.slice";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ScheduleView = ({ id }: { id: string }) => {
  const date = new Date();
  const stgroup = useAppSelector((state) => state.schedule.stgroup);
  const group = useAppSelector((state) => state.schedule.group);
  const isFetching = useAppSelector((state) => state.schedule.isFetching);
  const [lessonsWeek, setLessonsWeek] = useState<any[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState("main");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const load = async () => {
    let lessonsWeek: any[] = [];

    if (stgroup.length > 0 && group.length > 0) {
      dispatch(setIsFetching(true));
      for (var i = 0; i < 7; i++) {
        const result = new Date(date);
        result.setDate(result.getDate() - 60);
        result.setDate(result.getDate() + i);
        const parsedDate =
          result.getFullYear() +
          "-" +
          parseInt((result.getMonth() + 1).toString()) +
          "-" +
          result.getDate();

        const response = await api.get(
          `/schedule/lessons?stgroup=${stgroup}&group=${group}&day=${parsedDate}`
        );

        lessonsWeek.push({
          date: parsedDate,
          lessons: response.data,
        });
      }
      dispatch(setIsFetching(false));

      setLessonsWeek(lessonsWeek);
    }
    if (stgroup.length > 0 && group.length === 0) {
      setActiveModal("select");
    }
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
  }, [stgroup, group]);

  const onHeaderButtonClick = () => {
    setActiveModal("select");
  };

  const modal = (
    <ScheduleSettings
      activeModal={activeModal}
      onSettingsClose={() => {
        setActiveModal(null);
      }}
    />
  );

  const onHeaderScheduleClick = () => {
    setActivePanel("pdf");
  };

  return (
    <View id={id} activePanel={activePanel} modal={modal}>
      <Panel id="main">
        <PanelHeader
          left={
            <React.Fragment>
              <PanelHeaderButton onClick={onHeaderButtonClick}>
                <Icon28Settings />
              </PanelHeaderButton>{" "}
              {!bridge.isWebView() && (
                <PanelHeaderButton onClick={onHeaderScheduleClick}>
                  <Icon28ArticleOutline />
                </PanelHeaderButton>
              )}
            </React.Fragment>
          }
          separator={false}
        >
          Расписание
        </PanelHeader>

        {!isFetching ? (
          !stgroup || !group ? (
            <Placeholder
              header="Группа не выбрана"
              icon={<Icon56Users3Outline />}
              stretched
            />
          ) : (
            <ScheduleTableWeek
              isTeacher={false}
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
            <TransformWrapper>
              <TransformComponent>
                <Document
                  loading={<ScreenSpinner />}
                  options={{
                    cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                    cMapPacked: true,
                  }}
                  file={file}
                >
                  <Page
                    loading={<ScreenSpinner />}
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
