import styles from "./LessonCell.module.scss";
import moment from "moment";
import { Icon16User } from "@vkontakte/icons";
import clsx from "clsx";
import { useLazyTeachersControllerFindByNameQuery } from "../api/slices/teachers.enhanced";
import { Snackbar, Spinner } from "@vkontakte/vkui";
import { useAppDispatch } from "../api/store";
import {
  setScheduleModal,
  setScheduleSnackbar,
  setSelectedTeacher,
} from "../api/slices/schedule.slice";
import { setSnackbar } from "../api/slices/burger.slice";

const LessonCell = ({
  lesson,
  isTeacher,
}: {
  lesson: {
    start_time: string;
    end_time: string;
    audience: string;
    subject: string;
    type: string;
    teacher: string;
  };
  isTeacher?: boolean;
}) => {
  const isNow = moment().isBetween(
    moment(lesson.start_time),
    moment(lesson.end_time)
  );
  const [findByName, { isLoading }] =
    useLazyTeachersControllerFindByNameQuery();
  const dispatch = useAppDispatch();

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
            {lesson.start_time} - {lesson.end_time}
          </span>
          <div className={styles.lessonCell__time__status}>
            {!lesson.audience && lesson.subject ? "Онлайн" : lesson.audience}
          </div>
        </div>
        <div className={styles.lessonCell__subject}>{lesson.subject}</div>
        <div className={styles.lessonCell__type}>{lesson.type}</div>
        {lesson.teacher && (
          <div
            className={styles.lessonCell__teacher}
            onClick={async () => {
              try {
                const teacher = await findByName({
                  name: lesson.teacher,
                }).unwrap();

                dispatch(setSelectedTeacher(teacher));
                dispatch(setScheduleModal("teacher"));
              } catch (e) {
                dispatch(
                  setScheduleSnackbar(
                    <Snackbar onClose={() => dispatch(setSnackbar(null))}>
                      Преподаватель не найден
                    </Snackbar>
                  )
                );
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
      </div>
    </div>
  );
};

export default LessonCell;
