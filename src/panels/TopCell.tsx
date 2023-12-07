import { Cell, Avatar } from "@vkontakte/vkui";
import { StudentRatingDto } from "../api/slices/students.slice";

export function TopCell(props: { student: StudentRatingDto }) {
  const {
    stgroup,
    id,
    rating,
    firstName: first_name,
    lastName: last_name,
    photo: photo_50,
    number,
  } = props.student;

  return (
    <Cell
      asideContent={Math.round(Number(rating))}
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
      size={"m"}
      description={stgroup ? stgroup : null}
      href={`https://vk.com/id${id}`}
      target="_blank"
    >
      {`${first_name} ${last_name}`}
    </Cell>
  );
}

export default TopCell;
