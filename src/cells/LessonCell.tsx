import styles from "./LessonCell.module.scss";
import moment from "moment";
import { Icon16User, Icon16Users } from "@vkontakte/icons";
import clsx from "clsx";
import { useLazyTeachersControllerFindByNameQuery } from "../api/slices/teachers.enhanced";
import { Spinner } from "@vkontakte/vkui";
import { useAppDispatch } from "../api/store";
import {
  setScheduleModal,
  setSelectedTeacher,
} from "../api/slices/schedule.slice";

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
  const startTime = moment(lesson.start_time);
  const endTime = moment(lesson.start_time);
  // add 90 minutes if lesson time is less then 18 hours
  if (startTime.hours() > 18) {
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
