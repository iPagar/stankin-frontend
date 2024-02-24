import React, { ReactNode, useState } from "react";
import {
  FixedLayout,
  Gallery,
  Div,
  Calendar,
  LocaleProvider,
} from "@vkontakte/vkui";
import ScheduleTableDay from "./ScheduleTableDay";
import { HorizontalCalendar } from "./calendar";
import moment from "moment";
import { Icon24CalendarOutline } from "@vkontakte/icons";
import styles from "./ScheduleTableWeek.module.scss";
import { useClickAway } from "react-use";

const ScheduleTableWeek = ({
  lessonsWeek,
  isTeacher,
  before,
  ...props
}: {
  lessonsWeek: {
    date: string;
    lessons: {
      start_date: string;
      start_time: string;
      end_time: string;
      audience: string;
      subject: string;
      type: string;
      teacher: string;
    }[];
  }[];
  isTeacher?: boolean;
  before?: ReactNode;
  pickedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}) => {
  const [choosed, setChoosed] = useState(1);
  const [opened, setOpened] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  useClickAway(calendarRef, () => {
    setOpened(false);
  });

  return (
    <React.Fragment>
      {window.innerWidth >= 768 || (
        <FixedLayout vertical="top" filled>
          <div style={{ margin: 0, marginBottom: 16 }}>
            <div
              style={{
                position: "relative",
                height: 24,
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 12,
                marginBottom: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span>{moment(props.pickedDate).format("MMMM, YYYY")}</span>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  padding:
                    "var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)",
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
                onClick={() => {
                  setOpened(!opened);
                }}
                ref={ref}
              >
                <Icon24CalendarOutline fill="var(--vkui--color_text_accent)" />
              </div>
            </div>

            <HorizontalCalendar
              date={props.pickedDate}
              choosed={choosed}
              daysWithLessons={lessonsWeek
                .filter((day) => {
                  return day.lessons.length > 0;
                })
                .map((day) => moment(day.date, "YYYY.MM.DD").toDate())}
              onClick={({
                choosedDay,
                dayNumber,
              }: {
                choosedDay: number;
                dayNumber: number;
              }) => {
                setChoosed(dayNumber);
              }}
            />
          </div>
        </FixedLayout>
      )}
      {opened && ref && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            zIndex: 100,
            top: ref.current?.getBoundingClientRect().bottom,
            marginTop: 80,
            width: "100%",
          }}
        >
          <LocaleProvider value={"ru"}>
            <Calendar
              getRootRef={calendarRef}
              value={props.pickedDate}
              onChange={(date) => {
                props.onDateChange?.(date);
                setOpened(false);
                setChoosed(0);
              }}
            />
          </LocaleProvider>
        </div>
      )}

      <Div>
        {(window.innerWidth >= 768 && (
          <div>
            <div
              style={{
                position: "relative",
                height: 24,
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 12,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                maxWidth: 200,
              }}
            >
              <span>{moment(props.pickedDate).format("MMMM, YYYY")}</span>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  padding:
                    "var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)",
                  paddingTop: 0,
                  paddingBottom: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpened(!opened);
                }}
                ref={ref}
              >
                <Icon24CalendarOutline fill="var(--vkui--color_text_accent)" />
              </div>
            </div>
            {opened && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 100,
                }}
              >
                <LocaleProvider value={"ru"}>
                  <Calendar
                    getRootRef={calendarRef}
                    value={props.pickedDate}
                    onChange={(date) => {
                      props.onDateChange?.(date);
                      setOpened(false);
                    }}
                  />
                </LocaleProvider>
              </div>
            )}
            {before && (
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  margin: 16,
                }}
              >
                {before}
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {lessonsWeek.map((lessonsDay, i) => (
                <div key={i} style={{ width: 300 }}>
                  <ScheduleTableDay
                    lessonsDay={lessonsDay.lessons}
                    isTeacher={isTeacher}
                    date={moment(lessonsWeek[i].date).toDate()}
                    withHeaders
                  />
                </div>
              ))}
            </div>
          </div>
        )) || (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: 116,
            }}
          >
            {before}
            <Gallery
              slideWidth="100%"
              style={{ height: "100%" }}
              align="center"
              slideIndex={choosed - 1}
              onChange={(slideIndex) => {
                setChoosed(slideIndex + 1);
              }}
              className={styles.gallery}
            >
              {lessonsWeek.map((lessonsDay, i) => (
                <ScheduleTableDay
                  key={i}
                  lessonsDay={lessonsDay.lessons}
                  isTeacher={isTeacher}
                  date={moment(lessonsWeek[i].date).toDate()}
                />
              ))}
            </Gallery>
          </div>
        )}
      </Div>
    </React.Fragment>
  );
};

export default ScheduleTableWeek;
