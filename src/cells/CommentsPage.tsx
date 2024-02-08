import React, { Fragment } from "react";
import {
  ModalPage,
  ModalPageHeader,
  Div,
  usePlatform,
  PanelHeaderButton,
  Spinner,
  Placeholder,
  Button,
  CardGrid,
  Group,
  Cell,
} from "@vkontakte/vkui";
import {
  Icon24Cancel,
  Icon24Done,
  Icon56ArticleOutline,
} from "@vkontakte/icons";

import CommentCell from "./CommentCell";
import { useAppDispatch, useAppSelector } from "../api/store";
import { useStudentsControllerGetMeQuery } from "../api/slices/students.slice";
import { useTeachersControllerGetCommentsQuery } from "../api/slices/teachers.enhanced";
import { setActiveModal } from "../api/slices/burger.slice";

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
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setActiveModal(null));
  };

  const onWriteClick = () => {
    dispatch(setActiveModal("text"));
  };
  const platform = usePlatform();

  return (
    <ModalPage
      dynamicContentHeight={dynamicContentHeight}
      id={id}
      onClose={onClose}
      header={<ModalPageHeader>Комментарии</ModalPageHeader>}
    >
      <Div style={{ minHeight: 300 }}>
        {!isLoading ? (
          (comments && comments.length > 0 && (
            <React.Fragment>
              <CardGrid size="l">
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
                  <Button size="l" stretched onClick={onWriteClick}>
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
