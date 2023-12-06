import React, { useState, useRef } from "react";
import {
  ModalCard,
  FormLayout,
  Textarea,
  Checkbox,
  Snackbar,
  FormStatus,
} from "@vkontakte/vkui";
import { setBurgerModal, setSnackbar } from "../redux/actions";
import { useDispatch } from "react-redux";
import { Icon20Info } from "@vkontakte/icons";
import { useAppSelector } from "../api/store";
import { useTeachersControllerPutCommentMutation } from "../api/slices/teachers.enhanced";

const WriteCommentCard = ({ id }: { id: string }) => {
  const teacherId = useAppSelector((state) => state.burger.teacher);
  const [formStatus, setFormStatus] = useState<React.ReactNode>(null);
  const dispatch = useDispatch();
  const textRef = useRef<HTMLTextAreaElement>();
  const checkboxRef = useRef<HTMLInputElement>();

  const onClose = () => {
    dispatch(setBurgerModal(null));
  };

  const [putComment] = useTeachersControllerPutCommentMutation();

  const onWriteClick = async () => {
    if (
      textRef.current &&
      checkboxRef.current &&
      textRef.current.value.length > 100 &&
      textRef.current.value.length < 700
    ) {
      try {
        await putComment({
          teacherId,
          putCommentDto: {
            comment: textRef.current.value,
            isPublic: !checkboxRef.current.checked,
          },
        }).unwrap();
        dispatch(
          setSnackbar(
            <Snackbar
              before={<Icon20Info />}
              layout="vertical"
              onClose={() => dispatch(setSnackbar(null))}
            >
              Комментарий отправлен!
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
    } else {
      setFormStatus(
        <FormStatus mode="default">
          Напишите более 100 символов(и менее 700)! Дайте подробную и, в то же
          время, компактную информацию!
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
          getRef={(ref) => {
            if (ref) {
              textRef.current = ref;
            }
          }}
          style={{ height: 200 }}
          placeholder="Оцените отношение к студентам и стиль преподавания. Расскажите о сдаче семинаров и лаб, экзаменов и зачетов. Поделитесь о работе над курсовым проектом и другими учебными взаимодействиями."
        />
        <Checkbox
          getRef={(ref) => {
            if (ref) {
              checkboxRef.current = ref;
            }
          }}
        >
          Анонимно
        </Checkbox>
      </FormLayout>
    </ModalCard>
  );
};

export default WriteCommentCard;
