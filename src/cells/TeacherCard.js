import React from "react";
import {
	Cell,
	Avatar,
	Card,
	Link,
	MiniInfoCell,
	CellButton,
	Group,
	UsersStack,
	Snackbar,
} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import { findNumbers } from "libphonenumber-js";
import { useSelector, useDispatch } from "react-redux";
import { setBurgerModal, setTeacher, setSnackbar } from "../redux/actions";
import { api } from "../services";

import Icon28CommentCircleFillGreen from "@vkontakte/icons/dist/28/comment_circle_fill_green";
import Icon28AddCircleFillBlue from "@vkontakte/icons/dist/28/add_circle_fill_blue";

import Icon28MailOutline from "@vkontakte/icons/dist/28/mail_outline";
import Icon20PhoneOutline from "@vkontakte/icons/dist/20/phone_outline";
import Icon24Copy from "@vkontakte/icons/dist/24/copy";
import Icon20Info from "@vkontakte/icons/dist/20/info";

import like from "../img/reactions/like.svg";
import love from "../img/reactions/love.svg";
import haha from "../img/reactions/haha.svg";
import think from "../img/reactions/think.png";
import yaw from "../img/reactions/yaw.png";
import angry from "../img/reactions/angry.svg";
import dislike from "../img/reactions/dislike.svg";
import Icon20ShareOutline from "@vkontakte/icons/dist/20/share_outline";

const TeacherCard = ({ teacher, onRefresh }) => {
	const student = useSelector((state) => state.init.student);
	const dispatch = useDispatch();

	const onCommentClick = () => {
		dispatch(setTeacher(teacher.name));
		dispatch(setBurgerModal("comments"));
	};

	const onEmoClick = async () => {
		if (teacher.reactions.my !== true) {
			dispatch(setTeacher(teacher.name));
			dispatch(setBurgerModal("reactions"));
		} else {
			try {
				await api.delete("/teachers/reactions", {
					params: { name: teacher.name },
				});
				onRefresh();
			} catch (e) {
				// dispatch(
				// 	setSnackbar(
				// 		<Snackbar
				// 			before={<Icon20Info />}
				// 			layout="vertical"
				// 			onClose={() => dispatch(setSnackbar(null))}
				// 		>
				// 			Ошибка!
				// 		</Snackbar>
				// 	)
				// );
			}
		}
	};

	const reactionsPhotos = () => {
		const count = teacher.reactions.data.reduce((sum, reaction) => {
			return +sum + parseInt(reaction.count);
		}, 0);

		let photos = teacher.reactions.data.map((reaction) => {
			switch (reaction.reaction) {
				case 1:
					return like;
				case 2:
					return love;
				case 3:
					return haha;
				case 4:
					return think;
				case 5:
					return yaw;
				case 6:
					return angry;
				default:
					return dislike;
			}
		});

		for (var i = photos.length; i < count; i++) {
			photos = photos.concat({});
		}

		return photos;
	};

	return (
		<Card size="l">
			<Cell
				multiline
				key={teacher.name}
				size="l"
				before={
					<Avatar
						size={48}
						style={{
							objectFit: "cover",
						}}
						src={
							teacher.avatar
								? `https://stankin.ru${teacher.avatar}`
								: "https://vk.com/images/camera_200.png?ava=1"
						}
						onClick={() => {
							bridge.send("VKWebAppShowImages", {
								images: [
									teacher.avatar
										? `https://stankin.ru${teacher.avatar}`
										: "https://vk.com/images/camera_200.png?ava=1",
								],
							});
						}}
					/>
				}
				indicator={
					<Icon20ShareOutline
						onClick={() => {
							bridge.send("VKWebAppShare", {
								link: `https://vk.com/stankin.moduli#teachers?${encodeURI(
									teacher.name
								)}`,
							});
						}}
					/>
				}
				bottomContent={
					<div>
						<Group>
							{teacher.phone &&
								findNumbers(teacher.phone, "RU", {
									v2: true,
								}).length > 0 && (
									<MiniInfoCell
										textWrap="full"
										before={<Icon20PhoneOutline />}
										after={
											<Icon24Copy
												width={20}
												height={20}
												onClick={async () => {
													try {
														await bridge.send(
															"VKWebAppCopyText",
															{
																text: findNumbers(
																	teacher.phone,
																	"RU",
																	{
																		v2: true,
																	}
																)[0].number.formatNational(),
															}
														);
														dispatch(
															setSnackbar(
																<Snackbar
																	before={
																		<Icon20PhoneOutline />
																	}
																	layout="vertical"
																	onClose={() =>
																		dispatch(
																			setSnackbar(
																				null
																			)
																		)
																	}
																>
																	Скопировано!
																</Snackbar>
															)
														);
													} catch (e) {
														dispatch(
															setSnackbar(
																<Snackbar
																	before={
																		<Icon20Info />
																	}
																	layout="vertical"
																	onClose={() =>
																		dispatch(
																			setSnackbar(
																				null
																			)
																		)
																	}
																>
																	Ошибка!
																</Snackbar>
															)
														);
													}
												}}
											/>
										}
									>
										<Link
											href={`tel:${teacher.phone}`}
											target="_blank"
										>
											{findNumbers(teacher.phone, "RU", {
												v2: true,
											})[0].number.formatNational()}
										</Link>
									</MiniInfoCell>
								)}
							{teacher.email && (
								<MiniInfoCell
									textWrap="full"
									before={
										<Icon28MailOutline
											width={20}
											height={20}
										/>
									}
									after={
										<Icon24Copy
											width={20}
											height={20}
											onClick={async () => {
												try {
													await bridge.send(
														"VKWebAppCopyText",
														{
															text: teacher.email,
														}
													);
													dispatch(
														setSnackbar(
															<Snackbar
																before={
																	<Icon28MailOutline
																		width={
																			20
																		}
																		height={
																			20
																		}
																	/>
																}
																layout="vertical"
																onClose={() =>
																	dispatch(
																		setSnackbar(
																			null
																		)
																	)
																}
															>
																Скопировано!
															</Snackbar>
														)
													);
												} catch (e) {
													dispatch(
														setSnackbar(
															<Snackbar
																before={
																	<Icon20Info />
																}
																layout="vertical"
																onClose={() =>
																	dispatch(
																		setSnackbar(
																			null
																		)
																	)
																}
															>
																Ошибка!
															</Snackbar>
														)
													);
												}
											}}
										/>
									}
								>
									<Link
										href={`mailto:${teacher.email}`}
										target="_blank"
									>
										{teacher.email}
									</Link>
								</MiniInfoCell>
							)}
						</Group>
						<Group>
							{student.hasOwnProperty("student") ? (
								<CellButton
									before={
										!teacher.reactions.data.length ? (
											<Icon28AddCircleFillBlue
												height={24}
											/>
										) : (
											<div
												style={{
													display: "flex",
													justiifyContent: "center",
													alignItems: "center",
												}}
											>
												<UsersStack
													style={{
														padding: 0,
														paddingRight: 16,
													}}
													size="m"
													visibleCount={3}
													photos={reactionsPhotos()}
												/>
											</div>
										)
									}
									onClick={onEmoClick}
								>
									{!teacher.reactions.my
										? "Оценить"
										: "Вы оценили"}
								</CellButton>
							) : (
								<CellButton
									before={
										<div
											style={{
												display: "flex",
												justiifyContent: "center",
												alignItems: "center",
											}}
										>
											<UsersStack
												style={{
													padding: 0,
													paddingRight: 16,
												}}
												size="m"
												visibleCount={3}
												photos={reactionsPhotos()}
											/>
										</div>
									}
								/>
							)}
							<CellButton
								before={
									teacher.comments["length"] <= 1 ? (
										<Icon28CommentCircleFillGreen
											height={24}
										/>
									) : (
										<div
											style={{
												display: "flex",
												justiifyContent: "center",
												alignItems: "center",
											}}
										>
											<UsersStack
												style={{
													padding: 0,
													paddingRight: 16,
												}}
												size="m"
												visibleCount={0}
												photos={
													new Array(
														teacher.comments[
															"length"
														]
													)
												}
											/>
										</div>
									)
								}
								onClick={onCommentClick}
							>
								{student.hasOwnProperty("student")
									? !teacher.comments.my
										? "Комментарии"
										: "Отзыв оставлен"
									: "Комментарии"}
							</CellButton>
						</Group>
					</div>
				}
				description={teacher.position}
			>
				{teacher.name}
			</Cell>
		</Card>
	);
};

export default TeacherCard;
