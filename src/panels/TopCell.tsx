import { Cell, Avatar, Group, Card } from "@vkontakte/vkui";
import { StudentRatingDto } from "../api/slices/students.slice";

export function TopCell(props: { student: StudentRatingDto }) {
  const {
    stgroup,
    vkUserId,
    rating,
    firstName: first_name,
    lastName: last_name,
    photo: photo_50,
    number,
  } = props.student;

  return (
    <Card mode="outline">
      <Cell
        after={Math.round(Number(rating))}
        before={
          <div style={{ display: "flex", alignItems: "center", padding: 12 }}>
            <div
              style={{ display: "flex", alignItems: "left", paddingRight: 12 }}
            >{`${number}`}</div>
            <Avatar
              style={{ display: "flex", alignItems: "right" }}
              size={48}
              src={photo_50 ?? "https://vk.com/images/camera_50.png?ava=1"}
            />
          </div>
        }
        subtitle={stgroup ? stgroup : null}
        href={`https://vk.com/id${vkUserId}`}
        target="_blank"
      >
        {first_name && last_name ? `${first_name} ${last_name}` : "Неизвестный"}
      </Cell>
    </Card>
  );
}

export default TopCell;
