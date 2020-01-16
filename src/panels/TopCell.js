import React from "react";
import { Cell, Avatar } from "@vkontakte/vkui";

class TopCell extends React.Component {
  render() {
    const {
      stgroup,
      id,
      rating,
      first_name,
      last_name,
      photo_50,
      number
    } = this.props;

    return (
      <Cell
        asideContent={Math.round(rating)}
        before={
          <div style={{ display: "flex", alignItems: "center", padding: 12 }}>
            <div
              style={{ display: "flex", alignItems: "left", paddingRight: 12 }}
            >{`${number}`}</div>
            <Avatar
              style={{ display: "flex", alignItems: "right" }}
              size={48}
              src={photo_50}
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
}

export default TopCell;
