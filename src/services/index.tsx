import axios from "axios";

const sign = process.env.REACT_APP_TEST_SIGN ?? window.location.search;

export const api = axios.create({
  baseURL: "https://ipagar.ddns.net",
  timeout: 10000,
  headers: { "X-Sign-Header": sign },
});
