import React, { useEffect, useState } from "react";
import { Header, CardGrid, Placeholder, Group } from "@vkontakte/vkui";
import moment from "moment";
import "moment/locale/ru";
import LessonCell from "../cells/LessonCell";

import { Icon56GestureOutline } from "@vkontakte/icons";

moment.locale("ru");

const ScheduleTableDay = ({
  lessonsDay,
  withHeaders,
  isTeacher,
  number,
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
  number?: number;
  style?: React.CSSProperties;
}) => {
  const [parsedLessons, setParsedLessons] = useState<
    {
      start_date: string;
      start_time: string;
      end_time: string;
      audience: string;
      subject: string;
      type: string;
      teacher: string;
    }[]
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
    let lessonsDay: {
      start_date: string;
      start_time: string;
      end_time: string;
      audience: string;
      subject: string;
      type: string;
      teacher: string;
    }[] = [];
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
      });
    });

    if (isTeacher)
      lessonsDay = lessonsDay.map((lesson, i) => {
        return { ...lesson, stgroups: groups[i] };
      });

    return lessonsDay;
  };

  return (
    <div style={{ maxWidth: 400, display: "contents", ...style }}>
      <Header mode="secondary">
        {withHeaders && moment().add(number, "days").format("D MMMM, dddd")}
      </Header>

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
            return <LessonCell key={i} lesson={lesson} isTeacher={isTeacher} />;
          })}
        </Group>
      )) || <Placeholder icon={<Icon56GestureOutline />} header="Нет пар" />}
    </div>
  );
};

export default ScheduleTableDay;
