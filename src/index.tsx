import "core-js/features/map";
import "core-js/features/set";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import connect from "@vkontakte/vk-bridge";
import { App } from "./App";
import eruda from "eruda";
import { Banner } from "./views/banner";
import { ConfigProvider } from "@vkontakte/vkui";
import store from "./api/store";

// Init VK  Mini App
connect.send("VKWebAppInit", {});
connect.subscribe(({ detail: { type, data } }) => {
  if (type === "VKWebAppUpdateConfig") {
    if ("appearance" in data) {
      const schemeAttribute = document.createAttribute("scheme");
      schemeAttribute.value =
        data.appearance === "light" ? "bright_light" : "space_gray";
      document.body.attributes.setNamedItem(schemeAttribute);
    }
  }
});

// Init eruda
if (process.env.NODE_ENV === "development") {
  eruda.init();
}

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
    <Banner />
  </Provider>,
  document.getElementById("root")
);
