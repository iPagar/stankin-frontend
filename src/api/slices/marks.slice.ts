import { api } from "../api";
export const addTagTypes = ["Marks"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      marksControllerNotify: build.query<
        MarksControllerNotifyApiResponse,
        MarksControllerNotifyApiArg
      >({
        query: () => ({ url: `/api/marks/notify` }),
        providesTags: ["Marks"],
      }),
      marksControllerSwitchNotify: build.mutation<
        MarksControllerSwitchNotifyApiResponse,
        MarksControllerSwitchNotifyApiArg
      >({
        query: () => ({ url: `/api/marks/notify`, method: "POST" }),
        invalidatesTags: ["Marks"],
      }),
      marksControllerGetSemesterMarks: build.query<
        MarksControllerGetSemesterMarksApiResponse,
        MarksControllerGetSemesterMarksApiArg
      >({
        query: (queryArg) => ({ url: `/api/marks/${queryArg.semester}` }),
        providesTags: ["Marks"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as marks };
export type MarksControllerNotifyApiResponse =
  /** status 200 Returns true if student has notifications enabled */ boolean;
export type MarksControllerNotifyApiArg = void;
export type MarksControllerSwitchNotifyApiResponse =
  /** status 200 Switch notifications for student */ boolean;
export type MarksControllerSwitchNotifyApiArg = void;
export type MarksControllerGetSemesterMarksApiResponse =
  /** status 200 Returns marks for student for given semester */ MarkEntity[];
export type MarksControllerGetSemesterMarksApiArg = {
  semester: string;
};
export type MarkEntity = {
  id: number;
  semester: string;
  subject: string;
  module: string;
  value: number;
  factor: number;
};
export const {
  useMarksControllerNotifyQuery,
  useLazyMarksControllerNotifyQuery,
  useMarksControllerSwitchNotifyMutation,
  useMarksControllerGetSemesterMarksQuery,
  useLazyMarksControllerGetSemesterMarksQuery,
} = injectedRtkApi;
