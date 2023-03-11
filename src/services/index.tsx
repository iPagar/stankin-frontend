import axios from "axios";

const sign = window.location.search;

export const api = axios.create({
  baseURL: "https://ipagar.ddns.net",
  timeout: 10000,
  headers: { "X-Sign-Header": sign },
});
