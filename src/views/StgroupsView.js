import React, { Fragment, useState, useEffect } from "react";
import {
	View,
	Panel,
	PanelHeader,
	PanelSpinner,
	PanelHeaderBack,
	Cell,
	Group,
	Search,
	Footer,
} from "@vkontakte/vkui";
import { useDispatch } from "react-redux";
import { setActiveStgroup, setActiveGroup, setStory } from "../redux/actions";
import { api } from "../services";
// import ScreenSpinnerPromise from "vkui-screen-spinner-promise";

const StgroupsView = ({ id }) => {
	const [search, setSearch] = useState("");
	const [stgroups, setStgroups] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [popout, setPopout] = useState(null);
	const dispatch = useDispatch();

	const getStgroups = async () => {
		await api
			.get(`/schedule/stgroup?stgroup=${search}`)
			.then(({ data }) => {
				setStgroups(data);
			});

		setIsLoading(false);
	};

	useEffect(() => {
		getStgroups();
	}, []);

	const onBack = () => {
		dispatch(setStory("scheduleView"));
	};

	const filterStgroups = () => {
		return stgroups

			.filter(
				({ name }) =>
					name.toLowerCase().indexOf(search.toLowerCase()) > -1
			)
			.slice(0, 10);
	};

	return (
		<View id={id} activePanel="main" popout={popout}>
			<Panel id="main">
				<PanelHeader
					left={<PanelHeaderBack onClick={onBack} />}
					separator={false}
				>
					Выбор группы
				</PanelHeader>
				{!isLoading ? (
					<Fragment>
						<Search
							value={search}
							onChange={(e) => {
								setSearch(e.currentTarget.value);
							}}
						/>

						<Group separator="hide">
							{filterStgroups().map((stgroup) => (
								<Cell
									key={stgroup._id}
									onClick={() => {
										dispatch(
											setActiveStgroup(stgroup.name)
										);
										dispatch(setActiveGroup(""));
										onBack();
									}}
								>
									{stgroup.name}
								</Cell>
							))}
						</Group>
						{!search && <Footer>{stgroups.length} группы</Footer>}
					</Fragment>
				) : (
					<PanelSpinner size="large" />
				)}
			</Panel>
		</View>
	);
};

export default StgroupsView;
