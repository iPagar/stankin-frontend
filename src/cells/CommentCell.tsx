import { Cell, Link, Snackbar, Card } from "@vkontakte/vkui";
import { useDispatch } from "react-redux";
import { setBurgerModal, setSnackbar } from "../redux/actions";

import { Icon20Info } from "@vkontakte/icons";
import {
  PrivateCommentDto,
  PublicCommentDto,
} from "../api/slices/teachers.slice";
import { useAppSelector } from "../api/store";
import { useTeachersControllerDeleteCommentMutation } from "../api/slices/teachers.enhanced";

const CommentCell = ({
  comment,
}: {
  comment: PublicCommentDto | PrivateCommentDto;
}) => {
  const dispatch = useDispatch();
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

    dispatch(setBurgerModal(null));
  };

  return (
    <Card size="l">
      <Cell
        description={
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
        size="l"
        multiline
      >
        <span style={{ whiteSpace: "pre-line" }}>{comment.comment}</span>
      </Cell>
    </Card>
  );
};

export default CommentCell;
