import styles from "./LessonCell.module.scss";
import moment from "moment-timezone";
import { Icon16User, Icon16Users } from "@vkontakte/icons";
import clsx from "clsx";
import { useLazyTeachersControllerFindByNameQuery } from "../api/slices/teachers.enhanced";
import { Spinner } from "@vkontakte/vkui";
import { useAppDispatch } from "../api/store";
import {
  setScheduleModal,
  setSelectedTeacher,
} from "../api/slices/schedule.slice";
// TODO: what is this?
export function getBreakTime(startTime: string) {
  const time = moment(startTime);
  const hours = time.hours();

  switch (hours) {
    case 8:
      return moment("10", "mm");
    case 10:
      return moment("20", "mm");
    case 12:
      return moment("10", "mm");
    case 14:
      return moment("10", "mm");
    case 16:
      return moment("20", "mm");
    case 18:
      return moment("10", "mm");
    default:
      return moment("10", "mm");
  }
}
// TODO: what is this?
export function isLessonNext(lesson: { start_time: string }) {
  const now = moment().tz("Europe/Moscow");
  const lessonStartTime = moment.tz(
    lesson.start_time,
    "HH:mm",
    "Europe/Moscow"
  );
  const breakTime = getBreakTime(lesson.start_time);

  // Добавляем время перерыва к времени начала урока для корректировки времени начала
  const adjustedLessonStartTime = lessonStartTime
    .subtract(breakTime.hours(), "hours")
    .subtract(breakTime.minutes(), "minutes");

  // Определяем время окончания урока в зависимости от времени его начала
  let endTime = moment(lesson.start_time, "HH:mm");
  if (endTime.hours() > 18) {
    endTime.add(90, "minutes");
  } else {
    endTime.add(100, "minutes");
  }

  // Проверяем, что текущее время находится в пределах интервала до начала следующего урока
  if (now.isBefore(adjustedLessonStartTime)) {
    // Проверяем, что текущее время + длительность типичного урока (максимально возможная длительность для упрощения) не превышает время начала следующего урока
    // Это условие предполагает, что уроки идут один за другим без перерывов между ними, кроме указанных перерывов
    let maxLessonDuration = 100; // Максимальная длительность урока для упрощения проверки
    let nextPossibleLessonTime = now.add(maxLessonDuration, "minutes");
    if (
      nextPossibleLessonTime.isBefore(adjustedLessonStartTime) ||
      nextPossibleLessonTime.isSame(adjustedLessonStartTime)
    ) {
      return true; // Урок является следующим
    }
  }

  return false; // Урок не является следующим
}

const LessonCell = ({
  lesson,
  isTeacher,
  hideAudience,
  onAudienceClick,
}: {
  lesson: {
    start_time: string;
    end_time: string;
    audience?: string;
    subject: string;
    type: string;
    teacher?: string;
    stgroup?: string;
  };
  hideAudience?: boolean;
  isTeacher?: boolean;
  onAudienceClick?: (audience: string) => void;
}) => {
  // start_time приходит с бэкенда уже в московском времени
  const startTime = moment(lesson.start_time);
  const endTime = moment(lesson.start_time);
  const startMoscowTime = moment.tz(lesson.start_time, "Europe/Moscow");
  if (startMoscowTime.hours() >= 18) {
    endTime.add(90, "minute");
  } else {
    endTime.add(100, "minute");
  }
  const isNow = moment().isBetween(startTime, endTime);
  const [findByName, { isLoading }] =
    useLazyTeachersControllerFindByNameQuery();
  const dispatch = useAppDispatch();
  const teacherName = lesson.teacher;

  return (
    <div className={styles.lessonCell__wrapper}>
      {isNow && <div className={styles.lessonCell__line}></div>}
      <div
        className={clsx(
          styles.lessonCell,
          isNow ? styles.lessonCell__now : null
        )}
      >
        <div className={styles.lessonCell__time}>
          <span className={styles.lessonCell__time__time}>
            {startTime.format("HH:mm")} - {endTime.format("HH:mm")}
          </span>
          {hideAudience || (
            <div
              className={styles.lessonCell__time__status}
              onClick={() => {
                if (lesson.audience && onAudienceClick) {
                  onAudienceClick(lesson.audience);
                }
              }}
            >
              {!lesson.audience && lesson.subject ? "Онлайн" : lesson.audience}
            </div>
          )}
        </div>
        <div className={styles.lessonCell__subject}>{lesson.subject}</div>
        <div className={styles.lessonCell__type}>{lesson.type}</div>
        {teacherName && (
          <div
            className={styles.lessonCell__teacher}
            onClick={async () => {
              try {
                const teacher = await findByName({
                  name: teacherName,
                }).unwrap();

                dispatch(
                  setSelectedTeacher({ data: teacher, fio: teacherName })
                );
                dispatch(setScheduleModal("teacher"));
              } catch (e) {
                dispatch(setSelectedTeacher({ fio: teacherName }));
                dispatch(setScheduleModal("teacher"));
              }
            }}
          >
            <Icon16User fill="#99A2AD" />
            <span className={styles.lessonCell__teacher__name}>
              {lesson.teacher}
            </span>
            {isLoading && <Spinner size="small" />}
          </div>
        )}
        {lesson.stgroup && (
          <div className={styles.lessonCell__teacher}>
            <Icon16Users fill="#99A2AD" />
            <span
              className={clsx(
                styles.lessonCell__teacher__name,
                styles.lessonCell__teacher__name__stgroup
              )}
            >
              {lesson.stgroup}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCell;
