import { api } from "../api";
export const addTagTypes = ["App", "student-schedule"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      appControllerUpdateSchedule: build.mutation<
        AppControllerUpdateScheduleApiResponse,
        AppControllerUpdateScheduleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/app/update-schedule`,
          method: "POST",
          body: queryArg.updateScheduleDto,
        }),
        invalidatesTags: ["App"],
      }),
      studentScheduleControllerGetStudentSchedule: build.query<
        StudentScheduleControllerGetStudentScheduleApiResponse,
        StudentScheduleControllerGetStudentScheduleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/student-schedule/${queryArg.stgroup}`,
          params: { date: queryArg.date },
        }),
        providesTags: ["student-schedule"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as studentSchedule };
export type AppControllerUpdateScheduleApiResponse = unknown;
export type AppControllerUpdateScheduleApiArg = {
  /** Update schedule */
  updateScheduleDto: UpdateScheduleDto;
};
export type StudentScheduleControllerGetStudentScheduleApiResponse =
  /** status 200 Get student schedule */ SubjectDto[];
export type StudentScheduleControllerGetStudentScheduleApiArg = {
  /** Date in format YYYY-MM-DD */
  date: string;
  stgroup: string;
};
export type UpdateCourseDto = {
  courseExp: string;
  folderExp: string;
};
export type UpdateScheduleDto = {
  steps: UpdateCourseDto[];
  season: "spring" | "autumn";
  year: number;
};
export type SubjectDto = {
  audience: string;
  end_date: string;
  fileId: string;
  group: string;
  repeat: string;
  season: string;
  start_date: string;
  stgroup: string;
  subject: string;
  teacher: string;
  type: string;
  year: number;
  _id: string;
};
export const {
  useAppControllerUpdateScheduleMutation,
  useStudentScheduleControllerGetStudentScheduleQuery,
  useLazyStudentScheduleControllerGetStudentScheduleQuery,
} = injectedRtkApi;
