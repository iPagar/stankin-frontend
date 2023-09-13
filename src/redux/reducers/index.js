import { combineReducers } from "redux";
import config from "./config";
import init from "./init";
import schedule from "./schedule";
import burger from "./burger";
import { api } from "../../api/api";

export default combineReducers({
  [api.reducerPath]: api.reducer,
  config,
  init,
  schedule,
  burger,
});
