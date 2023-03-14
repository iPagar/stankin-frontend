import React, { useState } from "react";
import { FixedLayout, Gallery, Div } from "@vkontakte/vkui";
import ScheduleTableDay from "./ScheduleTableDay";
import HorizontalCalendar from "vkui-horizontal-calendar";
import { Banner } from "../views/banner";

const Calendar = HorizontalCalendar.default
  ? HorizontalCalendar.default
  : HorizontalCalendar;

const ScheduleTableWeek = ({ lessonsWeek, isTeacher, before }) => {
  const [choosed, setChoosed] = useState(1);
  const today = Date.now();

  return (
    <React.Fragment>
      {window.innerWidth >= 768 && <Banner />}
      {window.innerWidth >= 768 || (
        <FixedLayout vertical="top" filled>
          <div style={{ margin: 0 }}>
            <Calendar
              date={today}
              choosed={choosed}
              onClick={({ choosedDay, dayNumber }) => {
                setChoosed(dayNumber);
              }}
            />
          </div>
        </FixedLayout>
      )}

      <Div style={{ paddingTop: 60 }}>
        {(window.innerWidth >= 768 && (
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
                  lessonsDay={lessonsDay}
                  number={i}
                  isTeacher={isTeacher}
                  withHeaders
                />
              </div>
            ))}
          </div>
        )) || (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
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
            >
              {lessonsWeek.map((lessonsDay, i) => (
                <ScheduleTableDay
                  key={i}
                  lessonsDay={lessonsDay}
                  number={i}
                  isTeacher={isTeacher}
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
