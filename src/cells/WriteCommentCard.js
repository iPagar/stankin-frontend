import React, { useState, useRef } from "react";
import {
	ModalCard,
	FormLayout,
	Textarea,
	Checkbox,
	Snackbar,
	FormStatus,
} from "@vkontakte/vkui";
import { api } from "../services";
import { setBurgerModal, setSnackbar } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import Icon20Info from "@vkontakte/icons/dist/20/info";

const WriteCommentCard = ({ id }) => {
	const teacher = useSelector((state) => state.burger.teacher);
	const [formStatus, setFormStatus] = useState(null);
	const dispatch = useDispatch();
	const textRef = useRef();
	const checkboxRef = useRef();

	const onClose = () => {
		dispatch(setBurgerModal(null));
	};

	const onWriteClick = async () => {
		if (
			textRef.current.value.length > 100 &&
			textRef.current.value.length < 700
		) {
			try {
				await api.put(`/teachers/comments`, {
					comment: textRef.current.value,
					isPublic: !checkboxRef.current.checked,
					name: teacher,
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

			dispatch(setBurgerModal(null));
		} else {
			setFormStatus(
				<FormStatus mode="default">
					Напишите более 100 символов(и менее 700)! Дайте подробную и,
					в то же время, компактную информацию!
				</FormStatus>
			);
		}
	};

	return (
		<ModalCard
			id={id}
			onClose={onClose}
			header="Отзыв преподавателю"
			actions={[
				{
					title: "Написать отзыв",
					mode: "primary",
					action: onWriteClick,
				},
			]}
		>
			<FormLayout>
				{formStatus}
				<Textarea
					getRef={textRef}
					style={{ height: 200 }}
					placeholder="Оцените отношение к студентам и стиль преподавания. Расскажите о сдаче семинаров и лаб, экзаменов и зачетов. Поделитесь о работе над курсовым проектом и другими учебными взаимодействиями."
				/>
				<Checkbox getRef={checkboxRef}>Анонимно</Checkbox>
			</FormLayout>
		</ModalCard>
	);
};

export default WriteCommentCard;
