import axios from "axios";

const sign = window.location.search;

export const api = axios.create({
	baseURL: "https://ipagar.ddns.net:8088",
	timeout: 1000,
	headers: { "X-Sign-Header": sign }
});
