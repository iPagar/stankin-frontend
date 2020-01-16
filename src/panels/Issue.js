import React, { Component } from "react";
import { Placeholder, Button } from "@vkontakte/vkui";

import Icon56HistoryOutline from "@vkontakte/icons/dist/56/history_outline";

class Issue extends Component {
	render() {
		const { action, text } = this.props;
		return (
			<Placeholder icon={<Icon56HistoryOutline />} stretched>
				Ошибка
				<Button onClick={action}>{text}</Button>
			</Placeholder>
		);
	}
}

export default Issue;
