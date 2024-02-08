import React, { Fragment, useState } from "react";
import { Cell, Tooltip, FixedLayout, List } from "@vkontakte/vkui";
import { Icon16Cancel, Icon24Info } from "@vkontakte/icons";
import { MarkEntity } from "../api/slices/marks.slice";

function getFilteredMarks(marks: MarkEntity[]): FilteredMark[] {
  const groups = [];

  for (let element of marks) {
    let existingGroups = groups.filter(
      (group) => group.subject === element.subject
    );
    if (existingGroups.length > 0) {
      existingGroups[0].marks[`${element.module}`] = element.value;
    } else {
      let newGroup = {
        marks: {
          [`${element.module}`]: element.value,
        },
        subject: element.subject,
        factor: element.factor,
      };
      groups.push(newGroup);
    }
  }

  return groups;
}

function calcRating(marks: FilteredMark[]) {
  let sum = 0;
  let sumFactor = 0;

  marks.forEach((subject) => {
    let sumFactorSubject = 0;
    let sumSubject = 0;

    const { factor } = subject;

    Object.keys(subject.marks).forEach((module) => {
      const value = subject.marks[module] === 0 ? 25 : subject.marks[module];

      if (module === "М1") {
        sumFactorSubject += 3;
        sumSubject += value * 3;
      } else if (module === "М2") {
        sumFactorSubject += 2;
        sumSubject += value * 2;
      } else if (module === "З") {
        sumFactorSubject += 5;
        sumSubject += value * 5;
      } else if (module === "К") {
        sumFactorSubject += 5;
        sumSubject += value * 5;
      } else if (module === "Э") {
        sumFactorSubject += 7;
        sumSubject += value * 7;
      }
    });

    sumFactor += factor;
    sum += (sumSubject / sumFactorSubject) * factor;
  });

  const rating = (sum /= sumFactor);

  return Math.round(rating);
}

function isSemesterDone(marks: MarkEntity[]) {
  return marks.every((mark) => mark.value !== 0);
}

export function Divider({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        height: 1,
        backgroundColor: "var(--header_text)",
        opacity: 0.2,
        ...style,
      }}
    />
  );
}

export type FilteredMark = {
  marks: {
    [x: string]: number;
  };
  subject: string;
  factor: number;
};

function Table({ data }: { data: MarkEntity[] }) {
  const [marks, setMarks] = useState(data);
  const [editedMarks, setEditedMarks] = useState(getFilteredMarks(marks));
  const [isEdited, setIsEdited] = useState(false);
  const [rating, setRating] = useState<number | null>(
    isSemesterDone(marks) ? calcRating(getFilteredMarks(marks)) : null
  );
  const [tooltip, setTooltip] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.value = "";
  };

  function checkIsEdited(newMarks: FilteredMark[], oldMarks: FilteredMark[]) {
    return JSON.stringify(newMarks) !== JSON.stringify(oldMarks);
  }

  function handleMarkChange(value: string, subject: string, markKey: string) {
    // max length is 2
    if (value.length > 2) {
      return;
    }

    const updatedMarks = [...editedMarks];
    const i = updatedMarks.findIndex((mark) => mark.subject === subject);
    updatedMarks[i].marks[markKey] = parseInt(value)
      ? isNaN(parseInt(value))
        ? NaN
        : parseInt(value)
      : NaN;

    setEditedMarks(updatedMarks);
    setIsEdited(checkIsEdited(editedMarks, getFilteredMarks(marks)));
  }

  const handleBlur = (value: string, subject: string, markKey: string) => {
    const newValue = parseInt(value);
    const i = editedMarks.findIndex((mark) => mark.subject === subject);
    const oldValue = getFilteredMarks(marks)[i].marks[markKey];
    const newMarks = JSON.parse(JSON.stringify(editedMarks));

    if (!isNaN(newValue) && newValue >= 25 && newValue <= 54) {
      newMarks[i].marks[markKey] = newValue;
    } else {
      newMarks[i].marks[markKey] = oldValue ?? NaN.toString();
    }

    setEditedMarks(newMarks);
  };

  function getMarkValue(mark: string, subject: string) {
    const i = editedMarks.findIndex((mark) => mark.subject === subject);

    const value = editedMarks[i].marks[mark];

    return value ? (isNaN(value) ? "" : value) : "";
  }

  function getDefaultValue(mark: string, subject: string) {
    const i = getFilteredMarks(marks).findIndex(
      (mark) => mark.subject === subject
    );

    const value = getFilteredMarks(marks)[i].marks[mark];

    return value;
  }

  return (
    <div
      style={{
        marginBottom: "calc(var(--tabbar_height) + 48px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 500,
          backgroundColor: "var(--vkui--color_background_content)",
          borderRadius: 12,
          padding: 8,
          color: "var(--vkui--color_text_primary)",
          display: "grid",
          gridTemplateColumns: "18fr 1fr 1fr 1fr 1fr 1fr",
          rowGap: 4,
          margin: "0 16px",
        }}
      >
        {editedMarks.map((row, i) => {
          return (
            <Fragment key={i}>
              {i === 0 && (
                <>
                  <div>ПРЕДМЕТ</div>
                  <MarkHeader text="М1" />
                  <MarkHeader text="М2" />
                  <MarkHeader text="К" />
                  <MarkHeader text="З" />
                  <MarkHeader text="Э" />
                </>
              )}
              <Divider
                style={{
                  backgroundColor: "var(--vkui--color_separator_primary2x)",
                  opacity: 0.2,
                }}
              />
              <Divider
                style={{
                  backgroundColor: "var(--vkui--color_separator_primary2x)",
                  opacity: 0.2,
                }}
              />
              <Divider
                style={{
                  backgroundColor: "var(--vkui--color_separator_primary2x)",
                  opacity: 0.2,
                }}
              />
              <Divider
                style={{
                  backgroundColor: "var(--vkui--color_separator_primary2x)",
                  opacity: 0.2,
                }}
              />
              <Divider
                style={{
                  backgroundColor: "var(--vkui--color_separator_primary2x)",
                  opacity: 0.2,
                }}
              />
              <Divider
                style={{
                  backgroundColor: "var(--vkui--color_separator_primary2x)",
                  opacity: 0.2,
                }}
              />
              <div
                style={{
                  paddingRight: 8,
                  fontSize: 13,
                }}
              >
                {row.subject}
              </div>

              {getDefaultValue("М1", row.subject) >= 0 ? (
                <MarkInput
                  markKey="М1"
                  subject={row.subject}
                  value={getMarkValue("М1", row.subject)}
                  onChange={handleMarkChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              ) : (
                <MarkNotExist />
              )}
              {getDefaultValue("М2", row.subject) >= 0 ? (
                <MarkInput
                  markKey="М2"
                  subject={row.subject}
                  value={getMarkValue("М2", row.subject)}
                  onChange={handleMarkChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              ) : (
                <MarkNotExist />
              )}
              {getDefaultValue("К", row.subject) >= 0 ? (
                <MarkInput
                  markKey="К"
                  subject={row.subject}
                  value={getMarkValue("К", row.subject)}
                  onChange={handleMarkChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              ) : (
                <MarkNotExist />
              )}
              {getDefaultValue("З", row.subject) >= 0 ? (
                <MarkInput
                  markKey="З"
                  subject={row.subject}
                  value={getMarkValue("З", row.subject)}
                  onChange={handleMarkChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              ) : (
                <MarkNotExist />
              )}
              {getDefaultValue("Э", row.subject) >= 0 ? (
                <MarkInput
                  markKey="Э"
                  subject={row.subject}
                  value={getMarkValue("Э", row.subject)}
                  onChange={handleMarkChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              ) : (
                <MarkNotExist />
              )}
            </Fragment>
          );
        })}
      </div>
      {calcRating(editedMarks) > 0 && (
        <FixedLayout vertical="bottom">
          <List>
            <Cell
              style={{
                backgroundColor: "var(--vkui--color_background_content)",
              }}
              indicator={
                isEdited ? (
                  <div
                    onClick={() => {
                      setEditedMarks(getFilteredMarks(marks));
                      setIsEdited(false);
                    }}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    {"Сбросить"}
                  </div>
                ) : null
              }
              after={
                <Tooltip
                  placement="top-end"
                  text="Модули без оценки считаются минимальными. Нажмите на оценку, чтобы изменить ее."
                  shown={tooltip}
                  onShownChange={(e) => setTooltip(e)}
                >
                  <div>
                    {!rating && (
                      <div
                        style={{ float: "right" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTooltip(true);
                        }}
                      >
                        <Icon24Info fill={"#5181b8"} />
                      </div>
                    )}
                  </div>
                </Tooltip>
              }
            >
              {!rating && `Ожидаемый`} {`Рейтинг: `}
              {calcRating(editedMarks)}
            </Cell>
          </List>
        </FixedLayout>
      )}
    </div>
  );
}

export default Table;

const MarkHeader = ({ text }: { text: string }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 4,
        paddingRight: 4,
        width: 20,
        paddingBottom: 8,
        fontWeight: 500,
      }}
    >
      {text}
    </div>
  );
};

const MarkNotExist = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Icon16Cancel width={18} height={18} />
    </div>
  );
};

type MarkInputProps = {
  markKey: string;
  subject: string;
  value: string | number;
  onChange: (value: string, subject: string, markKey: string) => void;
  onBlur: (value: string, subject: string, markKey: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const MarkInput = ({
  markKey,
  subject,
  value,
  onChange,
  onBlur,
  onFocus,
}: MarkInputProps) => {
  return (
    <input
      style={{
        border: "none",
        textAlign: "center",
        width: "100%",
        outline: "none",
        padding: 0,
        color: "var(--vkui--color_text_primary)",
        background: "transparent",
        fontSize: 13,
      }}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value, subject, markKey)}
      onBlur={(e) => onBlur(e.target.value, subject, markKey)}
      onFocus={onFocus}
    />
  );
};
