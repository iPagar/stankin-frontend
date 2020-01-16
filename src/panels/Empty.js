import React, { Component } from "react";
import { Placeholder } from "@vkontakte/vkui";

import Icon56HistoryOutline from "@vkontakte/icons/dist/56/history_outline";

class Empty extends Component {
	render() {
		return (
			<Placeholder icon={<Icon56HistoryOutline />} stretched>
				Пусто
			</Placeholder>
		);
	}
}

export default Empty;
