import { Cell, Link, Snackbar, Card, CardGrid, Group } from "@vkontakte/vkui";

import { Icon20Info } from "@vkontakte/icons";
import {
  PrivateCommentDto,
  PublicCommentDto,
} from "../api/slices/teachers.slice";
import { useAppDispatch, useAppSelector } from "../api/store";
import { useTeachersControllerDeleteCommentMutation } from "../api/slices/teachers.enhanced";
import { setActiveModal, setSnackbar } from "../api/slices/burger.slice";

const CommentCell = ({
  comment,
}: {
  comment: PublicCommentDto | PrivateCommentDto;
}) => {
  const dispatch = useAppDispatch();
  const [deleteComment] = useTeachersControllerDeleteCommentMutation();
  const teacherId = useAppSelector((state) => state.burger.teacher);

  const onDelClick = async () => {
    try {
      await deleteComment({
        teacherId,
      }).unwrap();
      dispatch(
        setSnackbar(
          <Snackbar
            before={<Icon20Info />}
            layout="vertical"
            onClose={() => dispatch(setSnackbar(null))}
          >
            Комментарий удален!
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

    dispatch(setActiveModal(null));
  };

  return (
    <Card>
      <Cell
        subtitle={
          <div>
            {comment.type === "public" ? (
              <Link
                href={`https://vk.com/id${comment.vkId}`}
                target="_blank"
              >{`id${comment.vkId}`}</Link>
            ) : (
              "Аноним"
            )}
            •{new Date(comment.createdAt).toLocaleDateString()}
            {comment.my && "•"}
            {comment.my && <Link onClick={onDelClick}>Удалить</Link>}
          </div>
        }
        multiline
      >
        <span style={{ whiteSpace: "pre-line" }}>{comment.comment}</span>
      </Cell>
    </Card>
  );
};

export default CommentCell;
