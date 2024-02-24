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
      studentScheduleControllerGetAudiencies: build.query<
        StudentScheduleControllerGetAudienciesApiResponse,
        StudentScheduleControllerGetAudienciesApiArg
      >({
        query: () => ({ url: `/api/student-schedule/audiencies` }),
        providesTags: ["student-schedule"],
      }),
      studentScheduleControllerGetAudienceSchedule: build.query<
        StudentScheduleControllerGetAudienceScheduleApiResponse,
        StudentScheduleControllerGetAudienceScheduleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/student-schedule/audiencies/${queryArg.audience}`,
        }),
        providesTags: ["student-schedule"],
      }),
      studentScheduleControllerGetTeacherSchedule: build.query<
        StudentScheduleControllerGetTeacherScheduleApiResponse,
        StudentScheduleControllerGetTeacherScheduleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/student-schedule/teachers/${queryArg.name}`,
          params: { date: queryArg.date },
        }),
        providesTags: ["student-schedule"],
      }),
      studentScheduleControllerGetTeacherLatestSchedule: build.query<
        StudentScheduleControllerGetTeacherLatestScheduleApiResponse,
        StudentScheduleControllerGetTeacherLatestScheduleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/student-schedule/teachers/${queryArg.name}/latest`,
        }),
        providesTags: ["student-schedule"],
      }),
      studentScheduleControllerGetStudentSchedule: build.query<
        StudentScheduleControllerGetStudentScheduleApiResponse,
        StudentScheduleControllerGetStudentScheduleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/student-schedule/${queryArg.stgroup}`,
          params: { date: queryArg.date, group: queryArg.group },
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
export type StudentScheduleControllerGetAudienciesApiResponse =
  /** status 200 Get audiencies */ string[];
export type StudentScheduleControllerGetAudienciesApiArg = void;
export type StudentScheduleControllerGetAudienceScheduleApiResponse =
  /** status 200 Get audience schedule */ SubjectDto[];
export type StudentScheduleControllerGetAudienceScheduleApiArg = {
  audience: string;
};
export type StudentScheduleControllerGetTeacherScheduleApiResponse =
  /** status 200 Get teacher schedule */ SubjectDto[];
export type StudentScheduleControllerGetTeacherScheduleApiArg = {
  name: string;
  date: string;
};
export type StudentScheduleControllerGetTeacherLatestScheduleApiResponse =
  /** status 200 Get latest teacher schedule */ SubjectDto[];
export type StudentScheduleControllerGetTeacherLatestScheduleApiArg = {
  name: string;
};
export type StudentScheduleControllerGetStudentScheduleApiResponse =
  /** status 200 Get student schedule */ SubjectDto[];
export type StudentScheduleControllerGetStudentScheduleApiArg = {
  /** Date in format YYYY-MM-DD */
  date: string;
  /** Student group */
  group?: string;
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
  useStudentScheduleControllerGetAudienciesQuery,
  useLazyStudentScheduleControllerGetAudienciesQuery,
  useStudentScheduleControllerGetAudienceScheduleQuery,
  useLazyStudentScheduleControllerGetAudienceScheduleQuery,
  useStudentScheduleControllerGetTeacherScheduleQuery,
  useLazyStudentScheduleControllerGetTeacherScheduleQuery,
  useStudentScheduleControllerGetTeacherLatestScheduleQuery,
  useLazyStudentScheduleControllerGetTeacherLatestScheduleQuery,
  useStudentScheduleControllerGetStudentScheduleQuery,
  useLazyStudentScheduleControllerGetStudentScheduleQuery,
} = injectedRtkApi;
