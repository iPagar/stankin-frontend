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
        query: (queryArg) => ({
          url: `/api/students`,
          params: { page: queryArg.page, limit: queryArg.limit },
        }),
        providesTags: ["Students"],
      }),
      studentsControllerGetRating: build.query<
        StudentsControllerGetRatingApiResponse,
        StudentsControllerGetRatingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/students/rating`,
          params: {
            semester: queryArg.semester,
            search: queryArg.search,
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Students"],
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
      studentsControllerGetStudentSemesters: build.query<
        StudentsControllerGetStudentSemestersApiResponse,
        StudentsControllerGetStudentSemestersApiArg
      >({
        query: () => ({ url: `/api/students/semesters` }),
        providesTags: ["Students"],
      }),
      studentsControllerGetOne: build.query<
        StudentsControllerGetOneApiResponse,
        StudentsControllerGetOneApiArg
      >({
        query: (queryArg) => ({ url: `/api/students/${queryArg.id}` }),
        providesTags: ["Students"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as students };
export type StudentsControllerGetMeApiResponse =
  /** status 200 Student retrieved successfully */ StudentDto;
export type StudentsControllerGetMeApiArg = void;
export type StudentsControllerGetAllApiResponse =
  /** status 200 Students retrieved successfully */ {
    data: StudentDto[];
    total: number;
  };
export type StudentsControllerGetAllApiArg = {
  /** Semester to filter by */
  semester?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type StudentsControllerGetRatingApiResponse =
  /** status 200 Students retrieved successfully */ {
    data: StudentRatingDto[];
    total: number;
  };
export type StudentsControllerGetRatingApiArg = {
  /** Semester to filter by */
  semester?: string;
  /** Search by student's name */
  search?: any;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type StudentsControllerLoginApiResponse = unknown;
export type StudentsControllerLoginApiArg = {
  /** Student's id and password */
  loginDto: LoginDto;
};
export type StudentsControllerLogoutApiResponse = unknown;
export type StudentsControllerLogoutApiArg = void;
export type StudentsControllerGetStudentSemestersApiResponse =
  /** status 200 Student's semesters retrieved successfully */ string[];
export type StudentsControllerGetStudentSemestersApiArg = void;
export type StudentsControllerGetOneApiResponse =
  /** status 200 Student retrieved successfully */ StudentDto;
export type StudentsControllerGetOneApiArg = {
  id: number;
};
export type StudentDto = {
  id: number;
  student: number;
  surname: object | null;
  initials: object | null;
  stgroup: object | null;
  notify: object | null;
  is_deleted: boolean;
};
export type StudentRatingDto = {
  number: string;
  id: string;
  stgroup: string;
  rating: number;
  photo: object;
  firstName: object;
  lastName: object;
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
  useStudentsControllerGetRatingQuery,
  useLazyStudentsControllerGetRatingQuery,
  useStudentsControllerLoginMutation,
  useStudentsControllerLogoutMutation,
  useStudentsControllerGetStudentSemestersQuery,
  useLazyStudentsControllerGetStudentSemestersQuery,
  useStudentsControllerGetOneQuery,
  useLazyStudentsControllerGetOneQuery,
} = injectedRtkApi;
