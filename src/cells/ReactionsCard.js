import React from "react";
import { ModalCard, Div, Snackbar } from "@vkontakte/vkui";
import { setBurgerModal, setSnackbar } from "../redux/actions";
import { api } from "../services";
import { useSelector, useDispatch } from "react-redux";

import Icon20Info from "@vkontakte/icons/dist/20/info";

import like from "../img/reactions/like.svg";
import love from "../img/reactions/love.svg";
import haha from "../img/reactions/haha.svg";
import think from "../img/reactions/think.png";
import yaw from "../img/reactions/yaw.png";
import angry from "../img/reactions/angry.svg";
import dislike from "../img/reactions/dislike.svg";

const ReactionsCard = ({ id }) => {
	const name = useSelector((state) => state.burger.teacher);
	const dispatch = useDispatch();

	const onClose = () => {
		dispatch(setBurgerModal(null));
	};

	const onWriteClick = async (e) => {
		try {
			await api.put(`/teachers/reactions`, {
				name,
				reaction: e.target.dataset.reaction,
			});
			dispatch(
				setSnackbar(
					<Snackbar
						before={<Icon20Info />}
						layout="vertical"
						onClose={() => dispatch(setSnackbar(null))}
					>
						Оценка поставлена! Потяните список вниз, чтобы обновить!
					</Snackbar>
				)
			);
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

		onClose();
	};

	return (
		<ModalCard
			id={id}
			onClose={onClose}
			header="Какое чувство вызывает преподаватель?"
		>
			<Div style={{ display: "flex", justifyContent: "space-between" }}>
				<img
					src={like}
					height={28}
					alt="like"
					data-reaction={1}
					onClick={onWriteClick}
				/>
				<img
					src={love}
					height={28}
					alt="love"
					data-reaction={2}
					onClick={onWriteClick}
				/>
				<img
					src={haha}
					height={28}
					alt="haha"
					data-reaction={3}
					onClick={onWriteClick}
				/>
				<img
					src={think}
					height={28}
					alt="think"
					data-reaction={4}
					onClick={onWriteClick}
				/>
				<img
					src={yaw}
					height={28}
					alt="yaw"
					data-reaction={5}
					onClick={onWriteClick}
				/>
				<img
					src={angry}
					height={28}
					alt="angry"
					data-reaction={6}
					onClick={onWriteClick}
				/>
				<img
					src={dislike}
					height={28}
					alt="dislike"
					data-reaction={7}
					onClick={onWriteClick}
				/>
			</Div>
		</ModalCard>
	);
};

export default ReactionsCard;
