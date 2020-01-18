import axios from "axios";

const sign = window.location.search;

export const api = axios.create({
	baseURL: "https://ipagar.ddns.net:8088",
	timeout: 10000,
	headers: { "X-Sign-Header": sign }
});
