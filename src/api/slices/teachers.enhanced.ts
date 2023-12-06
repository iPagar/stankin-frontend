import { teachers } from "./teachers.slice";

export const enhancedApi = teachers.enhanceEndpoints({});

export const {
  useTeachersControllerPutReactionMutation,
  useTeachersControllerDeleteReactionMutation,
  useTeachersControllerGetCommentsQuery,
  useLazyTeachersControllerGetCommentsQuery,
  useTeachersControllerPutCommentMutation,
  useTeachersControllerDeleteCommentMutation,
  useTeachersControllerGetTeachersQuery,
  useLazyTeachersControllerGetTeachersQuery,
} = enhancedApi;
