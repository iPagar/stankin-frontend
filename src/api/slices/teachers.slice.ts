import { api } from "../api";
export const addTagTypes = ["Teachers"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      teachersControllerPutReaction: build.mutation<
        TeachersControllerPutReactionApiResponse,
        TeachersControllerPutReactionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/teachers/${queryArg.teacherId}/reactions`,
          method: "PUT",
          body: queryArg.putReactionDto,
        }),
        invalidatesTags: ["Teachers"],
      }),
      teachersControllerDeleteReaction: build.mutation<
        TeachersControllerDeleteReactionApiResponse,
        TeachersControllerDeleteReactionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/teachers/${queryArg.teacherId}/reactions`,
          method: "DELETE",
        }),
        invalidatesTags: ["Teachers"],
      }),
      teachersControllerGetComments: build.query<
        TeachersControllerGetCommentsApiResponse,
        TeachersControllerGetCommentsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/teachers/${queryArg.teacherId}/comments`,
        }),
        providesTags: ["Teachers"],
      }),
      teachersControllerPutComment: build.mutation<
        TeachersControllerPutCommentApiResponse,
        TeachersControllerPutCommentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/teachers/${queryArg.teacherId}/comments`,
          method: "PUT",
          body: queryArg.putCommentDto,
        }),
        invalidatesTags: ["Teachers"],
      }),
      teachersControllerDeleteComment: build.mutation<
        TeachersControllerDeleteCommentApiResponse,
        TeachersControllerDeleteCommentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/teachers/${queryArg.teacherId}/comments`,
          method: "DELETE",
        }),
        invalidatesTags: ["Teachers"],
      }),
      teachersControllerGetTeachers: build.query<
        TeachersControllerGetTeachersApiResponse,
        TeachersControllerGetTeachersApiArg
      >({
        query: (queryArg) => ({
          url: `/api/teachers`,
          params: {
            name: queryArg.name,
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Teachers"],
      }),
      teachersControllerRequestUpdateTeachers: build.mutation<
        TeachersControllerRequestUpdateTeachersApiResponse,
        TeachersControllerRequestUpdateTeachersApiArg
      >({
        query: () => ({ url: `/api/teachers/update`, method: "POST" }),
        invalidatesTags: ["Teachers"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as teachers };
export type TeachersControllerPutReactionApiResponse = unknown;
export type TeachersControllerPutReactionApiArg = {
  teacherId: string;
  putReactionDto: PutReactionDto;
};
export type TeachersControllerDeleteReactionApiResponse = unknown;
export type TeachersControllerDeleteReactionApiArg = {
  teacherId: string;
};
export type TeachersControllerGetCommentsApiResponse =
  /** status 200 List of comments */ (PublicCommentDto | PrivateCommentDto)[];
export type TeachersControllerGetCommentsApiArg = {
  teacherId: string;
};
export type TeachersControllerPutCommentApiResponse = unknown;
export type TeachersControllerPutCommentApiArg = {
  teacherId: string;
  putCommentDto: PutCommentDto;
};
export type TeachersControllerDeleteCommentApiResponse = unknown;
export type TeachersControllerDeleteCommentApiArg = {
  teacherId: string;
};
export type TeachersControllerGetTeachersApiResponse =
  /** status 200 List of teachers */ {
    data: TeacherDto[];
    total: number;
  };
export type TeachersControllerGetTeachersApiArg = {
  /** Teacher name */
  name?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type TeachersControllerRequestUpdateTeachersApiResponse = unknown;
export type TeachersControllerRequestUpdateTeachersApiArg = void;
export type PutReactionDto = {
  reaction: number;
};
export type PublicCommentDto = {
  comment: string;
  type: "public";
  my: boolean;
  createdAt: string;
  vkId: string;
};
export type PrivateCommentDto = {
  comment: string;
  type: "private";
  my: boolean;
  createdAt: string;
};
export type PutCommentDto = {
  comment: string;
  isPublic: boolean;
};
export type ReactionsDto = {
  count: number;
  data: object;
  my: number | null;
};
export type CommentsDto = {
  count: number;
  my: boolean;
};
export type TeacherDto = {
  id: string;
  name: string;
  position: string;
  qualification: string;
  updatedAt: string;
  createdAt: string;
  subjects: string;
  status: string;
  reactions: ReactionsDto;
  comments: CommentsDto;
  details: object;
};
