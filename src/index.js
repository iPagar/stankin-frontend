import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import connect from "@vkontakte/vk-bridge";
import App from "./App";
import store from "./redux/store";
import { setScheme } from "./redux/actions";

// Init VK  Mini App
connect.send("VKWebAppInit", {});
connect.subscribe(({ detail: { type, data } }) => {
	if (type === "VKWebAppUpdateConfig") {
		const scheme = data.scheme ? data.scheme : "client_light";
		store.dispatch(setScheme(scheme));
		const schemeAttribute = document.createAttribute("scheme");
		schemeAttribute.value = scheme;
		document.body.attributes.setNamedItem(schemeAttribute);
	}
});

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);
