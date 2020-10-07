import { combineReducers } from "redux";
import config from "./config";
import init from "./init";
import schedule from "./schedule";

export default combineReducers({ config, init, schedule });
