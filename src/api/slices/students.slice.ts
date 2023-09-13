import { api } from "../api";
export const addTagTypes = ["Students"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      studentsControllerGetMe: build.query<
        StudentsControllerGetMeApiResponse,
        StudentsControllerGetMeApiArg
      >({
        query: () => ({ url: `/api/students/me` }),
        providesTags: ["Students"],
      }),
      studentsControllerGetAll: build.query<
        StudentsControllerGetAllApiResponse,
        StudentsControllerGetAllApiArg
      >({
        query: () => ({ url: `/api/students` }),
        providesTags: ["Students"],
      }),
      studentsControllerPost: build.mutation<
        StudentsControllerPostApiResponse,
        StudentsControllerPostApiArg
      >({
        query: () => ({ url: `/api/students`, method: "POST" }),
        invalidatesTags: ["Students"],
      }),
      studentsControllerGetOne: build.query<
        StudentsControllerGetOneApiResponse,
        StudentsControllerGetOneApiArg
      >({
        query: (queryArg) => ({ url: `/api/students/${queryArg.id}` }),
        providesTags: ["Students"],
      }),
      studentsControllerRemove: build.mutation<
        StudentsControllerRemoveApiResponse,
        StudentsControllerRemoveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/students/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Students"],
      }),
      studentsControllerLogin: build.mutation<
        StudentsControllerLoginApiResponse,
        StudentsControllerLoginApiArg
      >({
        query: (queryArg) => ({
          url: `/api/students/login`,
          method: "POST",
          body: queryArg.loginDto,
        }),
        invalidatesTags: ["Students"],
      }),
      studentsControllerLogout: build.mutation<
        StudentsControllerLogoutApiResponse,
        StudentsControllerLogoutApiArg
      >({
        query: () => ({ url: `/api/students/logout`, method: "POST" }),
        invalidatesTags: ["Students"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as students };
export type StudentsControllerGetMeApiResponse =
  /** status 200 Student retrieved successfully */ GetStudentDto;
export type StudentsControllerGetMeApiArg = void;
export type StudentsControllerGetAllApiResponse =
  /** status 200 Students retrieved successfully */ GetStudentDto[];
export type StudentsControllerGetAllApiArg = void;
export type StudentsControllerPostApiResponse = unknown;
export type StudentsControllerPostApiArg = void;
export type StudentsControllerGetOneApiResponse =
  /** status 200 Student retrieved successfully */ GetStudentDto;
export type StudentsControllerGetOneApiArg = {
  id: number;
};
export type StudentsControllerRemoveApiResponse = unknown;
export type StudentsControllerRemoveApiArg = {
  id: number;
};
export type StudentsControllerLoginApiResponse = unknown;
export type StudentsControllerLoginApiArg = {
  /** Student's id and password */
  loginDto: LoginDto;
};
export type StudentsControllerLogoutApiResponse = unknown;
export type StudentsControllerLogoutApiArg = void;
export type GetStudentDto = {
  id: number;
  student: number;
  surname: string;
  initials: string;
  stgroup: string;
  notify: boolean;
  is_deleted: boolean;
};
export type LoginDto = {
  studentId: string;
  password: string;
};
export const {
  useStudentsControllerGetMeQuery,
  useLazyStudentsControllerGetMeQuery,
  useStudentsControllerGetAllQuery,
  useLazyStudentsControllerGetAllQuery,
  useStudentsControllerPostMutation,
  useStudentsControllerGetOneQuery,
  useLazyStudentsControllerGetOneQuery,
  useStudentsControllerRemoveMutation,
  useStudentsControllerLoginMutation,
  useStudentsControllerLogoutMutation,
} = injectedRtkApi;
