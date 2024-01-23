import { api } from "../api";
export const addTagTypes = ["App"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      appControllerGetSemesters: build.query<
        AppControllerGetSemestersApiResponse,
        AppControllerGetSemestersApiArg
      >({
        query: () => ({ url: `/api/app/semesters` }),
        providesTags: ["App"],
      }),
      appControllerGetSchoolarship: build.query<
        AppControllerGetSchoolarshipApiResponse,
        AppControllerGetSchoolarshipApiArg
      >({
        query: () => ({ url: `/api/app/schoolarship` }),
        providesTags: ["App"],
      }),
      appControllerMongoBackup: build.mutation<
        AppControllerMongoBackupApiResponse,
        AppControllerMongoBackupApiArg
      >({
        query: () => ({ url: `/api/app/mongo-backup`, method: "POST" }),
        invalidatesTags: ["App"],
      }),
      appControllerMongoPgBackup: build.mutation<
        AppControllerMongoPgBackupApiResponse,
        AppControllerMongoPgBackupApiArg
      >({
        query: () => ({ url: `/api/app/pg-backup`, method: "POST" }),
        invalidatesTags: ["App"],
      }),
      appControllerMongoRestore: build.mutation<
        AppControllerMongoRestoreApiResponse,
        AppControllerMongoRestoreApiArg
      >({
        query: () => ({ url: `/api/app/mongo-restore`, method: "POST" }),
        invalidatesTags: ["App"],
      }),
      appControllerMongoPgRestore: build.mutation<
        AppControllerMongoPgRestoreApiResponse,
        AppControllerMongoPgRestoreApiArg
      >({
        query: () => ({ url: `/api/app/pg-restore`, method: "POST" }),
        invalidatesTags: ["App"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as app };
export type AppControllerGetSemestersApiResponse =
  /** status 200 Semesters retrieved successfully */ string[];
export type AppControllerGetSemestersApiArg = void;
export type AppControllerGetSchoolarshipApiResponse =
  /** status 200 Schoolarship retrieved successfully */ SchoolarshipDto;
export type AppControllerGetSchoolarshipApiArg = void;
export type AppControllerMongoBackupApiResponse = unknown;
export type AppControllerMongoBackupApiArg = void;
export type AppControllerMongoPgBackupApiResponse = unknown;
export type AppControllerMongoPgBackupApiArg = void;
export type AppControllerMongoRestoreApiResponse = unknown;
export type AppControllerMongoRestoreApiArg = void;
export type AppControllerMongoPgRestoreApiResponse = unknown;
export type AppControllerMongoPgRestoreApiArg = void;
export type SchoolarshipDto = {
  files: string[];
  schoolarship: string[];
};
export const {
  useAppControllerGetSemestersQuery,
  useLazyAppControllerGetSemestersQuery,
  useAppControllerGetSchoolarshipQuery,
  useLazyAppControllerGetSchoolarshipQuery,
  useAppControllerMongoBackupMutation,
  useAppControllerMongoPgBackupMutation,
  useAppControllerMongoRestoreMutation,
  useAppControllerMongoPgRestoreMutation,
} = injectedRtkApi;
