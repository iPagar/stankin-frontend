import React from "react";
import PropTypes from "prop-types";
import {
  HorizontalScroll,
  Headline,
  classNames,
  usePlatform,
  useAppearance,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

export const HorizontalCalendar = ({
  date = new Date(),
  choosed = 1,
  isDarkWeekend = true,
  mondayFirst = false,
  onClick,
}: {
  date?: Date;
  choosed?: number;
  isDarkWeekend?: boolean;
  mondayFirst?: boolean;
  onClick?: (e: { choosedDay: number; dayNumber: number }) => void;
}) => {
  const platform = usePlatform();
  const baseClassNames = classNames("Card", platform);

  const onItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const choosedDay = e.currentTarget.dataset.day;

    if (!choosedDay) return;

    const dayNumber =
      adays.findIndex((day) => day.toString() === choosedDay) + 1;

    onClick && onClick({ choosedDay: Number(choosedDay), dayNumber });
  };

  const itemStyle = {
    flexShrink: 0,
    height: 29,
    width: 29,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    clipPath: "circle()",
  } as const;

  const days = () => {
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const result = new Date(date);
      result.setDate(result.getDate() + i);
      dates.push(result);
    }

    return dates;
  };

  const daysMondayFirst = () => {
    const dates = [];

    const selected = new Date(date);

    const fromMonday = selected.getDay() ? selected.getDay() - 1 : 6;
    const monday = selected.setDate(selected.getDate() - fromMonday);

    for (let i = 0; i < 7; i++) {
      const result = new Date(monday);
      result.setDate(result.getDate() + i);
      dates.push(result);
    }

    return dates;
  };

  const getNameOfDay = (day: number) => {
    switch (day) {
      case 0:
        return "Вс";
      case 1:
        return "Пн";
      case 2:
        return "Вт";
      case 3:
        return "Ср";
      case 4:
        return "Чт";
      case 5:
        return "Пт";
      case 6:
        return "Сб";
      default:
        throw new RangeError("Day must be between 0 and 6");
    }
  };

  const adays = mondayFirst ? daysMondayFirst() : days();
  const appearence = useAppearance();
  const light = appearence === "light";

  return (
    <HorizontalScroll
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        {adays.map((day, i) => {
          const dayNumber = day.getDay();

          return (
            <div
              key={day.toString()}
              className={"day"}
              style={{
                color:
                  isDarkWeekend && (dayNumber === 0 || dayNumber === 6)
                    ? "var(--vkui--color_text_secondary)"
                    : "var(--vkui--color_text_primary)",
              }}
              onClick={onItemClick}
              data-day={day}
            >
              <div
                style={{
                  ...itemStyle,
                  backgroundColor:
                    choosed - 1 === i
                      ? light
                        ? "var(--vkui--color_text_accent)"
                        : "var(--vkui--color_text_primary)"
                      : "var(--vkui--color_background_secondary)",
                  color:
                    choosed - 1 === i
                      ? light
                        ? "white"
                        : "var(--vkui--color_separator_secondary)"
                      : isDarkWeekend && (dayNumber === 0 || dayNumber === 6)
                      ? "var(--vkui--color_text_secondary)"
                      : "var(--vkui--color_text_primary)",
                }}
                className={baseClassNames}
              >
                <Headline weight="1">{day.getDate()}</Headline>
              </div>
              <div>{getNameOfDay(dayNumber)}</div>
            </div>
          );
        })}
      </div>
    </HorizontalScroll>
  );
};

HorizontalCalendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  isDarkWeekend: PropTypes.bool,
  choosed: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7]),
  platform: PropTypes.string,
  onClick: PropTypes.func,
};
