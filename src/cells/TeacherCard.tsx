import {
  Cell,
  Avatar,
  Card,
  Link,
  MiniInfoCell,
  CellButton,
  Group,
  UsersStack,
  Snackbar,
} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import { findNumbers } from "libphonenumber-js";
import { useDispatch } from "react-redux";
import { setBurgerModal, setTeacher, setSnackbar } from "../redux/actions";

import {
  Icon28CommentCircleFillGreen,
  Icon28AddCircleFillBlue,
  Icon28MailOutline,
  Icon20PhoneOutline,
  Icon24Copy,
  Icon20Info,
  Icon28CancelCircleFillRed,
  Icon20CommentCircleFillGray,
  Icon20ShareOutline,
} from "@vkontakte/icons";

import like from "../img/reactions/like.svg";
import love from "../img/reactions/love.svg";
import haha from "../img/reactions/haha.svg";
import think from "../img/reactions/think.png";
import yaw from "../img/reactions/yaw.png";
import angry from "../img/reactions/angry.svg";
import dislike from "../img/reactions/dislike.svg";
import { TeacherDto } from "../api/slices/teachers.slice";
import { useStudentsControllerGetMeQuery } from "../api/slices/students.slice";
import { useTeachersControllerDeleteReactionMutation } from "../api/slices/teachers.enhanced";

const TeacherCard = ({ teacher }: { teacher: TeacherDto }) => {
  const { data: student } = useStudentsControllerGetMeQuery();
  const dispatch = useDispatch();

  const onCommentClick = () => {
    dispatch(setTeacher(teacher.id));
    dispatch(setBurgerModal("comments"));
  };

  const phone: string | null =
    ("phone" in teacher.details &&
      typeof teacher.details.phone === "string" &&
      teacher.details.phone) ||
    null;
  const formattedPhone: string | null =
    phone && findNumbers(phone, "RU").length > 0
      ? findNumbers(phone, "RU")[0].phone
      : null;
  const email: string | null =
    "email" in teacher.details &&
    typeof teacher.details.email === "string" &&
    teacher.details.email
      ? teacher.details.email
      : null;
  const avatar =
    "avatar" in teacher.details && teacher.details.avatar
      ? `https://stankin.ru${teacher.details.avatar}`
      : "https://vk.com/images/camera_200.png?ava=1";

  const [deleteReaction] = useTeachersControllerDeleteReactionMutation();

  const onEmoClick = async () => {
    if (!teacher.reactions.my) {
      dispatch(setTeacher(teacher.id));
      dispatch(setBurgerModal("reactions"));
    } else {
      try {
        await deleteReaction({
          teacherId: teacher.id,
        }).unwrap();
        dispatch(
          setSnackbar(
            <Snackbar
              before={<Icon20Info />}
              layout="vertical"
              onClose={() => dispatch(setSnackbar(null))}
            >
              Оценка удалена!
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
    }
  };

  const reactionsPhotos = () => {
    let photos = Object.entries(teacher.reactions.data).map(
      ([key, reaction]) => {
        switch (key) {
          case "1":
            return like;
          case "2":
            return love;
          case "3":
            return haha;
          case "4":
            return think;
          case "5":
            return yaw;
          case "6":
            return angry;
          default:
            return dislike;
        }
      }
    );

    return photos;
  };

  return (
    <Card size="l">
      <Cell
        style={{ paddingLeft: 0, paddingBottom: 5 }}
        multiline
        key={teacher.name}
        size="l"
        before={
          <div
            style={{
              paddingTop: 12,
              paddingRight: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              size={80}
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                objectFit: "cover",
              }}
              src={avatar}
              onClick={() => {
                bridge.send("VKWebAppShowImages", {
                  images: [avatar],
                });
              }}
            />
            {teacher.reactions.count > 0 && (
              <UsersStack
                style={{
                  paddingBottom: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 5,
                }}
                visibleCount={3}
                photos={reactionsPhotos()}
              />
            )}

            {teacher.comments.count > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  objectFit: "cover",
                  paddingTop: 5,
                }}
              >
                <Icon20CommentCircleFillGray width={24} height={24} />
                <div
                  className="UsersStack__photo UsersStack__photo--others"
                  style={{
                    padding: 0,
                    width: 24,
                    height: 24,
                    marginLeft: 5,
                  }}
                >
                  {`+${teacher.comments.count}`}
                </div>
              </div>
            )}
          </div>
        }
        indicator={
          <div style={{ padding: 5 }}>
            <Icon20ShareOutline
              onClick={() => {
                bridge.send("VKWebAppShare", {
                  link: `https://vk.com/stankin.moduli#teachers?${encodeURI(
                    teacher.name
                  )}`,
                });
              }}
            />
          </div>
        }
        bottomContent={
          <div>
            <Group>
              {(phone || formattedPhone) && (
                <MiniInfoCell
                  style={{ paddingLeft: 0 }}
                  textWrap="full"
                  before={<Icon20PhoneOutline />}
                  after={
                    <Icon24Copy
                      width={20}
                      height={20}
                      onClick={async () => {
                        try {
                          await bridge.send("VKWebAppCopyText", {
                            text: (formattedPhone || phone)!,
                          });
                          dispatch(
                            setSnackbar(
                              <Snackbar
                                before={<Icon20PhoneOutline />}
                                layout="vertical"
                                onClose={() => dispatch(setSnackbar(null))}
                              >
                                Скопировано!
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
                      }}
                    />
                  }
                >
                  {formattedPhone ? (
                    <Link href={`tel:${formattedPhone}`} target="_blank">
                      {formattedPhone}
                    </Link>
                  ) : (
                    phone && (
                      <div style={{ color: "var(--text_secondary)" }}>
                        {phone}
                      </div>
                    )
                  )}
                </MiniInfoCell>
              )}
              {email && (
                <MiniInfoCell
                  style={{ paddingLeft: 0 }}
                  textWrap="full"
                  before={<Icon28MailOutline width={20} height={20} />}
                  after={
                    <Icon24Copy
                      width={20}
                      height={20}
                      onClick={async () => {
                        try {
                          await bridge.send("VKWebAppCopyText", {
                            text: email,
                          });
                          dispatch(
                            setSnackbar(
                              <Snackbar
                                before={
                                  <Icon28MailOutline width={20} height={20} />
                                }
                                layout="vertical"
                                onClose={() => dispatch(setSnackbar(null))}
                              >
                                Скопировано!
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
                      }}
                    />
                  }
                >
                  <Link href={`mailto:${email}`} target="_blank">
                    {email}
                  </Link>
                </MiniInfoCell>
              )}
            </Group>
            <Group>
              {student ? (
                <CellButton
                  style={{ paddingLeft: 0 }}
                  before={
                    !teacher.reactions.my ? (
                      <Icon28AddCircleFillBlue height={24} />
                    ) : (
                      <Icon28CancelCircleFillRed height={24} />
                    )
                  }
                  onClick={onEmoClick}
                >
                  {!teacher.reactions.my ? "Оценить" : "Убрать оценку"}
                </CellButton>
              ) : null}
              {student ? (
                <CellButton
                  style={{ paddingLeft: 0 }}
                  before={<Icon28CommentCircleFillGreen height={24} />}
                  onClick={onCommentClick}
                >
                  {!teacher.comments.my ? "Комментарии" : "Отзыв оставлен"}
                </CellButton>
              ) : teacher.comments.count ? (
                <CellButton
                  style={{ paddingLeft: 0 }}
                  before={<Icon28CommentCircleFillGreen height={24} />}
                  onClick={onCommentClick}
                >
                  Комментарии
                </CellButton>
              ) : null}
            </Group>
          </div>
        }
        description={teacher.position}
      >
        {teacher.name}
      </Cell>
    </Card>
  );
};

export default TeacherCard;
