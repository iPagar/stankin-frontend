import React, { Fragment } from "react";
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
} from "@vkontakte/vkui";
import { useDispatch } from "react-redux";
import { setBurgerModal } from "../redux/actions";
import {
  Icon24Cancel,
  Icon24Done,
  Icon56ArticleOutline,
} from "@vkontakte/icons";

import CommentCell from "./CommentCell";
import { useAppSelector } from "../api/store";
import { useStudentsControllerGetMeQuery } from "../api/slices/students.slice";
import { useTeachersControllerGetCommentsQuery } from "../api/slices/teachers.enhanced";

const CommentsPage = ({
  id,
  dynamicContentHeight,
}: {
  id: string;
  dynamicContentHeight: boolean;
}) => {
  const { data: student } = useStudentsControllerGetMeQuery();
  const teacherId = useAppSelector((state) => state.burger.teacher);
  const { data: comments, isLoading } = useTeachersControllerGetCommentsQuery({
    teacherId,
  });
  const platform = usePlatform();
  const dispatch = useDispatch();

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
                <PanelHeaderButton onClick={onClose}>Готово</PanelHeaderButton>
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
          (comments && comments.length > 0 && (
            <React.Fragment>
              <CardGrid>
                {comments.map((comment, i) => {
                  return <CommentCell key={i} comment={comment} />;
                })}
              </CardGrid>
              {student && !comments.some((comment) => comment.my) && (
                <div style={{ bottom: 0 }}>
                  <Div>
                    <Button size="l" stretched onClick={onWriteClick}>
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
                student && (
                  <Button size="l" onClick={onWriteClick}>
                    Написать отзыв
                  </Button>
                )
              }
              stretched
            >
              {student ? "Оставь первый комментарий!" : "Комментариев нет"}
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
