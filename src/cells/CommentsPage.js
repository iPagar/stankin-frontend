import React, { Fragment, useState, useEffect } from "react";
import {
	ModalPage,
	ModalPageHeader,
	ANDROID,
	IOS,
	Div,
	usePlatform,
	PanelHeaderButton,
	Spinner,
	Placeholder,
	Button,
	CardGrid,
	Snackbar,
} from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import { setBurgerModal, setSnackbar } from "../redux/actions";
import { api } from "../services";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon20Info from "@vkontakte/icons/dist/20/info";
import Icon24Done from "@vkontakte/icons/dist/24/done";

import CommentCell from "./CommentCell";
import Icon56ArticleOutline from "@vkontakte/icons/dist/56/article_outline";

const CommentsPage = ({ id, dynamicContentHeight }) => {
	const student = useSelector((state) => state.init.student);
	const [isLoading, setIsLoading] = useState(true);
	const [comments, setComments] = useState([]);
	const teacher = useSelector((state) => state.burger.teacher);
	const platform = usePlatform();
	const dispatch = useDispatch();

	const getComments = async () => {
		try {
			await api
				.get(`/teachers/comments?name=${teacher}`)
				.then((response) => {
					setComments(response.data);
				});
		} catch (e) {
			dispatch(
				setSnackbar(
					<Snackbar
						before={<Icon20Info />}
						layout="vertical"
						onClose={() => dispatch(setSnackbar(null))}
					>
						Ошибка!
					</Snackbar>
				)
			);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getComments();
	}, []);

	const onClose = () => {
		dispatch(setBurgerModal(null));
	};

	const onWriteClick = () => {
		dispatch(setBurgerModal("text"));
	};

	return (
		<ModalPage
			dynamicContentHeight={dynamicContentHeight}
			id={id}
			onClose={onClose}
			header={
				<ModalPageHeader
					left={
						<Fragment>
							{platform === ANDROID && (
								<PanelHeaderButton onClick={onClose}>
									<Icon24Cancel />
								</PanelHeaderButton>
							)}
						</Fragment>
					}
					right={
						<Fragment>
							{platform === ANDROID && (
								<PanelHeaderButton onClick={onClose}>
									<Icon24Done />
								</PanelHeaderButton>
							)}
							{platform === IOS && (
								<PanelHeaderButton onClick={onClose}>
									Готово
								</PanelHeaderButton>
							)}
						</Fragment>
					}
				>
					Комментарии
				</ModalPageHeader>
			}
		>
			<Div style={{ minHeight: 300 }}>
				{!isLoading ? (
					(comments.length > 0 && (
						<React.Fragment>
							<CardGrid>
								{comments.map((comment, i) => {
									return (
										<CommentCell
											key={i}
											comment={comment}
										/>
									);
								})}
							</CardGrid>
							{student.hasOwnProperty("student") &&
								!comments.some(
									(comment) => comment.id === student.id
								) && (
									<div style={{ bottom: 0 }}>
										<Div>
											<Button
												size="l"
												stretched
												onClick={onWriteClick}
											>
												Написать отзыв
											</Button>
										</Div>
									</div>
								)}
						</React.Fragment>
					)) || (
						<Placeholder
							icon={<Icon56ArticleOutline />}
							action={
								student.hasOwnProperty("student") && (
									<Button size="l" onClick={onWriteClick}>
										Написать отзыв
									</Button>
								)
							}
							stretched
						>
							{student.hasOwnProperty("student")
								? "Оставь первый комментарий!"
								: "Комментариев нет"}
						</Placeholder>
					)
				) : (
					<Spinner />
				)}
			</Div>
		</ModalPage>
	);
};

export default CommentsPage;
