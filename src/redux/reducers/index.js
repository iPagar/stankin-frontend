import { combineReducers } from "redux";
import config from "./config";
import init from "./init";
import schedule from "./schedule";
import burger from "./burger";
import { api } from "../../api/api";

export default combineReducers({
  config,
  init,
  schedule,
  burger,
  [api.reducerPath]: api.reducer,
});
