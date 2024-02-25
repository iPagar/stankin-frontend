import { SubjectDto } from "../api/slices/student-schedule.slice";
import moment from "moment";

export function groupByDateAndStgroup(lessons: SubjectDto[]) {
  const groupedByDate = lessons.reduce((acc, lesson) => {
    const date = moment(lesson.start_date).format("L");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(lesson);
    return acc;
  }, {} as Record<string, SubjectDto[]>);

  const groupedByDateAndStgroup = Object.entries(groupedByDate || {}).reduce(
    (acc, [date, lessons]) => {
      const lessonsByTime = lessons.reduce((acc, lesson) => {
        // Используем время начала урока как ключ для группировки
        const timeKey = moment(lesson.start_date).format("LT"); // 'LT' для локального временного формата
        // @ts-ignore
        if (!acc[timeKey]) {
          // @ts-ignore
          acc[timeKey] = {
            ...lesson,
            stgroup: [lesson.stgroup], // Преобразуем stgroup в массив для удобства слияния
          };
        } else {
          // Если урок на это время уже есть, добавляем stgroup к существующему
          // @ts-ignore
          acc[timeKey].stgroup.push(lesson.stgroup);
        }
        return acc;
      }, {});

      // Преобразуем массивы stgroup обратно в строки, разделенные запятыми
      Object.values(lessonsByTime).forEach((lesson: any) => {
        lesson.stgroup = lesson.stgroup.join(", ");
      });

      acc[date] = Object.values(lessonsByTime); // Сохраняем обработанные уроки обратно по датам
      return acc;
    },
    {} as Record<string, SubjectDto[]>
  );

  return groupedByDateAndStgroup;
}

export function groupByStgroup(lessons: SubjectDto[]) {
  return lessons.reduce((acc, lesson) => {
    if (!acc[lesson.stgroup]) {
      acc[lesson.stgroup] = [];
    }
    acc[lesson.stgroup].push(lesson);
    return acc;
  }, {} as Record<string, SubjectDto[]>);
}
