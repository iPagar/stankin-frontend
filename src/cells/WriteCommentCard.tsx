import React, { useState, useRef } from "react";
import {
  ModalCard,
  FormLayoutGroup,
  Textarea,
  Checkbox,
  Snackbar,
  FormStatus,
  FormItem,
  Button,
} from "@vkontakte/vkui";
import { Icon20Info } from "@vkontakte/icons";
import { useAppDispatch, useAppSelector } from "../api/store";
import { useTeachersControllerPutCommentMutation } from "../api/slices/teachers.enhanced";
import { setActiveModal, setSnackbar } from "../api/slices/burger.slice";

const WriteCommentCard = ({ id }: { id: string }) => {
  const teacherId = useAppSelector((state) => state.burger.teacher);
  const [formStatus, setFormStatus] = useState<React.ReactNode>(null);
  const dispatch = useAppDispatch();
  const textRef = useRef<HTMLTextAreaElement>();
  const checkboxRef = useRef<HTMLInputElement>();

  const onClose = () => {
    dispatch(setActiveModal(null));
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

      dispatch(setActiveModal(null));
    } else {
      // no more than 700 characters and no less than 100
      setFormStatus(
        <FormStatus mode="default">
          Отзыв должен быть не менее 100 и не более 700 символов
        </FormStatus>
      );
    }
  };

  return (
    <ModalCard
      id={id}
      onClose={onClose}
      header="Отзыв преподавателю"
      actions={
        <Button size="l" stretched mode="primary" onClick={onWriteClick}>
          Написать отзыв
        </Button>
      }
    >
      <FormLayoutGroup>
        <FormItem>{formStatus}</FormItem>
        <FormItem>
          <Textarea
            getRef={(ref) => {
              if (ref) {
                textRef.current = ref;
              }
            }}
            style={{ height: 200 }}
            placeholder="Оставьте отзыв о преподавателе"
          />
        </FormItem>
        <FormItem>
          <Checkbox
            getRef={(ref) => {
              if (ref) {
                checkboxRef.current = ref;
              }
            }}
          >
            Анонимно
          </Checkbox>
        </FormItem>
      </FormLayoutGroup>
    </ModalCard>
  );
};

export default WriteCommentCard;
