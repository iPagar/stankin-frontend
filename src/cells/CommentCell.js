import React from "react";
import { Cell, Link, Snackbar, Card } from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import { setBurgerModal, setSnackbar } from "../redux/actions";
import { api } from "../services";

import Icon20Info from "@vkontakte/icons/dist/20/info";

const CommentCell = ({ comment }) => {
	const student = useSelector((state) => state.init.student);
	const dispatch = useDispatch();

	const onDelClick = async () => {
		try {
			await api.delete("/teachers/comments", {
				params: { name: comment.name },
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
	};

	return (
		<Card size="l">
			<Cell
				description={
					<div>
						{(comment.is_public && (
							<Link
								href={`https://vk.com/id${comment.id}`}
								target="_blank"
							>{`id${comment.id}`}</Link>
						)) ||
							"Аноним"}
						•{comment.created_at}
						{comment.id === student.id && "•"}
						{comment.id === student.id && (
							<Link onClick={onDelClick}>Удалить</Link>
						)}
					</div>
				}
				size="l"
				multiline
			>
				{comment.comment}
			</Cell>
		</Card>
	);
};

export default CommentCell;
