import type { ConfigFile } from "@rtk-query/codegen-openapi";
import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.development",
});

const config: ConfigFile = {
  schemaFile: `${process.env.REACT_APP_API_URL}/api/docs-json`,
  apiFile: "./src/api/api.ts",
  apiImport: "api",
  outputFiles: {
    "./src/api/slices/students.slice.ts": {
      exportName: "students",
      filterEndpoints: /students/i,
    },
    "./src/api/slices/marks.slice.ts": {
      exportName: "marks",
      filterEndpoints: /marks/i,
    },
    "./src/api/slices/teachers.slice.ts": {
      exportName: "teachers",
      filterEndpoints: /teachers/i,
      hooks: false,
    },
    "./src/api/slices/app.slice.ts": {
      exportName: "app",
      filterEndpoints: /app/i,
    },
  },
  tag: true,
  hooks: {
    lazyQueries: true,
    mutations: true,
    queries: true,
  },
};

export default config;
