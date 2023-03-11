import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import connect from "@vkontakte/vk-bridge";
import App from "./App";
import store from "./redux/store";
import eruda from "eruda";

// Init VK  Mini App
connect.send("VKWebAppInit", {});
connect.subscribe(({ detail: { type, data } }) => {
  if (type === "VKWebAppUpdateConfig") {
    const schemeAttribute = document.createAttribute("scheme");
    schemeAttribute.value =
      data.appearance === "light" ? "bright_light" : "space_gray";
    document.body.attributes.setNamedItem(schemeAttribute);
  }
});

// Init eruda
if (import.meta.env.MODE === "development") {
  eruda.init();
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
