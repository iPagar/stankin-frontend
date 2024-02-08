import "core-js/features/map";
import "core-js/features/set";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import connect from "@vkontakte/vk-bridge";
import { App } from "./App";
import eruda from "eruda";
import { Banner } from "./views/banner";
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui";
import store from "./api/store";
import { createRoot } from "react-dom/client";

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

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
    <Banner />
  </Provider>
);
