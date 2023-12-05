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
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as app };
export type AppControllerGetSemestersApiResponse =
  /** status 200 Semesters retrieved successfully */ string[];
export type AppControllerGetSemestersApiArg = void;
export const {
  useAppControllerGetSemestersQuery,
  useLazyAppControllerGetSemestersQuery,
} = injectedRtkApi;
