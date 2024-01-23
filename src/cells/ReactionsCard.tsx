import { ModalCard, Div, Snackbar } from "@vkontakte/vkui";

import { Icon20Info } from "@vkontakte/icons";

import like from "../img/reactions/like.svg";
import love from "../img/reactions/love.svg";
import haha from "../img/reactions/haha.svg";
import think from "../img/reactions/think.png";
import yaw from "../img/reactions/yaw.png";
import angry from "../img/reactions/angry.svg";
import dislike from "../img/reactions/dislike.svg";
import { useAppDispatch, useAppSelector } from "../api/store";
import { useTeachersControllerPutReactionMutation } from "../api/slices/teachers.enhanced";
import { setActiveModal, setSnackbar } from "../api/slices/burger.slice";

const ReactionsCard = ({ id }: { id: string }) => {
  const teacherId = useAppSelector((state) => state.burger.teacher);
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setActiveModal(null));
  };

  const [putReaction] = useTeachersControllerPutReactionMutation();

  const onWriteClick = async ({ reaction }: { reaction: number }) => {
    try {
      await putReaction({
        putReactionDto: {
          reaction,
        },
        teacherId,
      }).unwrap();
      dispatch(
        setSnackbar(
          <Snackbar
            before={<Icon20Info />}
            layout="vertical"
            onClose={() => dispatch(setSnackbar(null))}
          >
            Оценка поставлена!
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
          onClick={() => {
            onWriteClick({ reaction: 1 });
          }}
        />
        <img
          src={love}
          height={28}
          alt="love"
          onClick={() => {
            onWriteClick({ reaction: 2 });
          }}
        />
        <img
          src={haha}
          height={28}
          alt="haha"
          onClick={() => {
            onWriteClick({ reaction: 3 });
          }}
        />
        <img
          src={think}
          height={28}
          alt="think"
          onClick={() => {
            onWriteClick({ reaction: 4 });
          }}
        />
        <img
          src={yaw}
          height={28}
          alt="yaw"
          onClick={() => {
            onWriteClick({ reaction: 5 });
          }}
        />
        <img
          src={angry}
          height={28}
          alt="angry"
          onClick={() => {
            onWriteClick({ reaction: 6 });
          }}
        />
        <img
          src={dislike}
          height={28}
          alt="dislike"
          onClick={() => {
            onWriteClick({ reaction: 7 });
          }}
        />
      </Div>
    </ModalCard>
  );
};

export default ReactionsCard;
