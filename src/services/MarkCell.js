import React from "react";
import { List, Group, Cell } from "@vkontakte/vkui";

class MarkCell extends React.Component {
  render() {
    const { mark } = this.props;

    return (
      <Group
        style={{ marginTop: 0, marginBottom: 15 }}
        title={
          <div
            style={{
              color: "var(--text_primary)",
              whiteSpace: "normal",
            }}
          >
            {mark.subject}
          </div>
        }
      >
        <Cell
          size="l"
          description={
            <div style={{ padding: 5 }}>
              {mark.hasOwnProperty("М1") ? (
                <Cell
                  before={`Модуль 1: ${
                    mark[`М1`] === 0 ? "Нет оценки" : mark[`М1`]
                  }`}
                />
              ) : null}
              {mark.hasOwnProperty("М2") ? (
                <Cell
                  before={`Модуль 2: ${
                    mark[`М2`] === 0 ? "Нет оценки" : mark[`М2`]
                  }`}
                />
              ) : null}
            </div>
          }
          bottomContent={
            <List>
              {mark.hasOwnProperty("К") ? (
                <Cell
                  asideContent={mark[`К`] === 0 ? "Нет оценки" : `${mark[`К`]}`}
                >
                  Курсовая
                </Cell>
              ) : null}
              {mark.hasOwnProperty("З") ? (
                <Cell
                  asideContent={mark[`З`] === 0 ? "Нет оценки" : `${mark[`З`]}`}
                >
                  Зачет
                </Cell>
              ) : null}
              {mark.hasOwnProperty("Э") ? (
                <Cell
                  asideContent={mark[`Э`] === 0 ? "Нет оценки" : `${mark[`Э`]}`}
                >
                  Экзамен
                </Cell>
              ) : null}
            </List>
          }
        />
      </Group>
    );
  }
}

export default MarkCell;
