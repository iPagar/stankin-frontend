import React, { useEffect, useState } from "react";
import { Header, CardGrid, Placeholder, Group } from "@vkontakte/vkui";
import moment from "moment";
import "moment/locale/ru";
import LessonCell from "../cells/LessonCell";

import { Icon56GestureOutline } from "@vkontakte/icons";
import { LessonBreak } from "../cells/lesson-break";
import { useLazyTeachersControllerFindByNameQuery } from "../api/slices/teachers.enhanced";
import {
  setScheduleModal,
  setSelectedAudience,
} from "../api/slices/schedule.slice";
import { useAppDispatch } from "../api/store";

moment.locale("ru");

const ScheduleTableDay = ({
  lessonsDay,
  withHeaders,
  isTeacher,
  date,
  style,
}: {
  lessonsDay: {
    start_date: string;
    start_time: string;
    end_time: string;
    audience: string;
    subject: string;
    type: string;
    teacher: string;
  }[];
  withHeaders?: boolean;
  isTeacher?: boolean;
  date: Date;
  style?: React.CSSProperties;
}) => {
  const [parsedLessons, setParsedLessons] = useState<
    (
      | {
          start_date: string;
          start_time: string;
          end_time: string;
          audience: string;
          subject: string;
          type: string;
          teacher: string;
          lessonType: "lesson";
        }
      | {
          lessonType: "break";
        }
    )[]
  >([]);

  useEffect(() => {
    setParsedLessons(createTableData(lessonsDay));
  }, [lessonsDay]);

  const createTableData = (
    data: {
      start_date: string;
      start_time: string;
      end_time: string;
      audience: string;
      subject: string;
      type: string;
      teacher: string;
    }[]
  ) => {
    let lessonsDay: (
      | {
          start_date: string;
          start_time: string;
          end_time: string;
          audience: string;
          subject: string;
          type: string;
          teacher: string;
          lessonType: "lesson";
        }
      | {
          lessonType: "break";
        }
    )[] = [];
    const groups = [[], [], [], [], [], [], [], []];
    data.forEach((lesson) => {
      const day = moment(lesson.start_date);

      lessonsDay.push({
        ...lesson,
        start_time: day.format("H:mm"),
        end_time:
          moment.utc(lesson.start_date).hours() + 3 < 18
            ? day.add(100, "minutes").format("H:mm")
            : day.add(90, "minutes").format("H:mm"),
        lessonType: "lesson",
      });
    });

    // find and add the window between pairs
    for (let i = 0; i < lessonsDay.length - 1; i++) {
      const lesson = lessonsDay[i];
      const nextLesson = lessonsDay[i + 1];
      if (lesson.lessonType === "break" || nextLesson.lessonType === "break")
        continue;
      const start = moment(lesson.end_time, "HH:mm");
      const end = moment(nextLesson.start_time, "HH:mm");

      if (end.diff(start, "minutes") > 40) {
        lessonsDay.splice(i + 1, 0, {
          lessonType: "break",
        });
      }
    }

    if (isTeacher)
      lessonsDay = lessonsDay.map((lesson, i) => {
        return { ...lesson, stgroups: groups[i] };
      });

    return lessonsDay;
  };
  const dispatch = useAppDispatch();

  return (
    <div style={{ maxWidth: 400, display: "contents", ...style }}>
      {withHeaders && (
        <Header mode="secondary">{moment(date).format("D MMMM, dddd")}</Header>
      )}

      {(lessonsDay.length > 0 && (
        <Group
          style={{
            margin: 0,
            padding: "12px 0",
            gap: 8,
            display: "flex",
            flexDirection: "column",
            background: "transparent",
          }}
          mode="plain"
        >
          {parsedLessons.map((lesson, i) => {
            return lesson.lessonType === "lesson" ? (
              <LessonCell
                key={i}
                lesson={lesson}
                isTeacher={isTeacher}
                onAudienceClick={(audience) => {
                  dispatch(setSelectedAudience(audience));
                  dispatch(setScheduleModal("audience"));
                }}
              />
            ) : (
              <LessonBreak key={i} />
            );
          })}
        </Group>
      )) || <Placeholder icon={<Icon56GestureOutline />} header="Нет пар" />}
    </div>
  );
};

export default ScheduleTableDay;
