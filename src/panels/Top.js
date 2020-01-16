import React from "react";
import {
	List,
	FixedLayout,
	Tabs,
	TabsItem,
	UsersStack,
	Spinner,
	Search,
	Placeholder
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import { api } from "../services";
import { setActiveBottomTab } from "../redux/actions";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

import TopCell from "./TopCell";
import Empty from "./Empty";

const vkc = new VKMiniAppAPI();

const mapStateToProps = state => {
	return {
		selectedSemester: state.init.selectedSemester,
		student: state.init.student,
		semesters: state.init.semesters,
		activeBottomTab: state.config.activeBottomTab
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onBottomTab: tag => {
			dispatch(setActiveBottomTab(tag));
		}
	};
};

class Top extends React.Component {
	state = {
		isFetching: true,
		top: [],
		isTop: true,
		hasMore: true,
		pageStart: 0,
		offset: 0,
		me: null,
		search: ""
	};

	selectBottomTab = e => {
		const tag = e.currentTarget.dataset.tag;

		this.props.onBottomTab(tag);
	};

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.selectedSemester !== this.props.selectedSemester ||
			prevProps.activeBottomTab !== this.props.activeBottomTab
		) {
			this.setState({
				search: "",
				pageStart: 0,
				hasMore: true,
				me: null,
				top: [],
				isFetching: true,
				isTop: true
			});
		}
	}

	onSearchChange = search => {
		this.setState({
			search,
			top: [],
			me: null,
			pageStart: 0,
			hasMore: true,
			isFetching: true
		});
	};

	myComponent = () => {
		const {
			search,
			isTop,
			pageStart,
			hasMore,
			top,
			me,
			isFetching
		} = this.state;
		const { activeBottomTab } = this.props;

		return (
			<div>
				{activeBottomTab === "rating" &&
					(top.length > 0 || search.length > 0) && (
						<Search
							placeholder={"Введите фамилию или группу"}
							value={search}
							onChange={this.onSearchChange}
						/>
					)}
				<div style={{ marginBottom: me ? 48 * 2 : 48 }}>
					{isTop ? (
						(!isFetching && !top.length && search && (
							<Placeholder>не найдено</Placeholder>
						)) || (
							<InfiniteScroll
								pageStart={pageStart}
								loadMore={this.loadTop}
								hasMore={hasMore}
								loader={<Spinner size={"large"} key={0} />}
							>
								<List>
									{top.map(student => (
										<TopCell
											key={student.id}
											{...student}
										/>
									))}
								</List>
							</InfiniteScroll>
						)
					) : (
						<Empty />
					)}
				</div>
			</div>
		);
	};

	fetchMe() {
		const { semesters, selectedSemester, activeBottomTab } = this.props;

		return vkc.getUserInfo().then(userInfo =>
			api
				.post(activeBottomTab === "rating" ? `/rating` : `/ratingst`, {
					semester: semesters[selectedSemester],
					search: userInfo.id
				})
				.then(rating => {
					console.log(rating);
					if (
						rating.data.find(
							student => student.id === userInfo.id
						) === undefined
					)
						return null;
					return {
						...rating.data.find(
							student => student.id === userInfo.id
						),
						...userInfo
					};
				})
		);
	}

	loadTop = () => {
		const { pageStart, search } = this.state;
		const { activeBottomTab, semesters, selectedSemester } = this.props;

		return vkc
			.getAuthToken(7010368)
			.then(auth =>
				api
					.post(`/${activeBottomTab}`, {
						semester: semesters[selectedSemester],
						search,
						offset: pageStart
					})

					.then(resp => ({
						students: resp.data,
						auth
					}))
			)
			.then(resp =>
				vkc
					.callAPIMethod("users.get", {
						request_id: 1,
						user_ids: resp.students
							.map(student => student.id)
							.toString(),
						fields: "photo_50",
						v: "5.103",
						access_token: resp.auth.accessToken
					})
					.then(users => ({
						students: resp.students,
						users
					}))
			)
			.then(resp => {
				const top = !pageStart
					? resp.users.map((user, i) => ({
							...user,
							...resp.students[i]
					  }))
					: [
							...this.state.top,
							...resp.users.map((user, i) => ({
								...user,
								...resp.students[i]
							}))
					  ];

				return top;
			})
			.then(resp => {
				return this.fetchMe().then(me => {
					if (pageStart === 0 && resp.length && !search) {
						this.setState(state => ({
							me: me,
							isTop: true,
							top: resp,
							hasMore: !(resp.length % 10),
							pageStart: state.pageStart + 1,
							isFetching: false
						}));
					} else if (pageStart === 0 && !resp.length && !search)
						this.setState(state => ({
							isTop: false
						}));
					else
						this.setState(state => ({
							me: me,
							isTop: true,
							top: resp,
							isFetching: false,
							hasMore: !(resp.length % 10),
							pageStart: state.pageStart + 1
						}));
				});
			})
			.catch(error => {
				this.setState({ top: [] });
			});
	};

	renderMe() {
		const { me } = this.state;

		return (
			<UsersStack
				style={{
					position: "fixed",
					bottom: "48px",
					zIndex: 3,
					background: "var(--background_content)",
					width: "100%"
				}}
				photos={[me.photo_100]}
			>
				{`Вы на ${me.number} месте`}
			</UsersStack>
		);
	}

	render() {
		const { me } = this.state;
		const { student, activeBottomTab } = this.props;

		return (
			<div style={{ marginTop: 48 }}>
				{this.myComponent()}
				{me && this.renderMe()}
				<FixedLayout vertical="bottom">
					<Tabs>
						<TabsItem
							data-tag={"rating"}
							onClick={this.selectBottomTab}
							selected={activeBottomTab === "rating"}
						>
							Станкин
						</TabsItem>
						<TabsItem
							data-tag={"ratingst"}
							onClick={this.selectBottomTab}
							selected={activeBottomTab === "ratingst"}
						>
							{`${student.stgroup}`}
						</TabsItem>
					</Tabs>
				</FixedLayout>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Top);
