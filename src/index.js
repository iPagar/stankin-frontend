import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import connect from "@vkontakte/vk-bridge";
import App from "./App";
import store from "./redux/store";

// Init VK  Mini App
connect.send("VKWebAppInit", {});
connect.subscribe(({ detail: { type, data } }) => {
	if (type === "VKWebAppUpdateConfig") {
		const schemeAttribute = document.createAttribute("scheme");
		schemeAttribute.value = data.scheme ? data.scheme : "client_light";
		document.body.attributes.setNamedItem(schemeAttribute);
	}
});

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);
