import {
  Card,
  Cell,
  Div,
  Group,
  Header,
  Headline,
  List,
  Placeholder,
  Subhead,
  Text,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { api } from "../services";
import { Icon16CalendarOutline, Icon56ErrorOutline } from "@vkontakte/icons";
import { format } from "date-fns";
import Lottie from "lottie-react";
import gearsAnimation from "../assets/gears.json";

type Mark = {
  semester: string;
  subject: string;
  module: string;
  prev_value: number;
  next_value: number;
  operation: "UPDATE" | "CREATE" | "DELETE";
  created_at: string;
};

type GroupedMarks = {
  [date: string]: {
    [semester: string]: ({
      modules: {
        [module: string]: Pick<Mark, "prev_value" | "next_value" | "operation">;
      };
    } & Pick<Mark, "subject">)[];
  };
};

export const formatSemester = (semester: string) => {
  return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
};

export function MarksHistory() {
  const [marks, setMarks] = useState<GroupedMarks>({});
  const [loading, setLoading] = useState(true);

  async function getMarksHistory() {
    const response = await api.get<Mark[]>("/marks/history");

    // group by date and by semester and by module
    const marks = response.data
      .filter((mark) => mark.operation === "UPDATE")
      .reduce((acc: GroupedMarks, mark: Mark) => {
        const date = format(new Date(mark.created_at), "yyyy-MM-dd").toString();

        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][mark.semester]) {
          acc[date][mark.semester] = [];
        }
        const subject = acc[date][mark.semester].find(
          (subject) => subject.subject === mark.subject
        );
        if (!subject) {
          acc[date][mark.semester].push({
            subject: mark.subject,
            modules: {
              [mark.module]: {
                prev_value: mark.prev_value,
                next_value: mark.next_value,
                operation: mark.operation,
              },
            },
          });
        } else {
          subject.modules[mark.module] = {
            prev_value: mark.prev_value,
            next_value: mark.next_value,
            operation: mark.operation,
          };
        }

        return acc;
      }, {});
    setMarks(marks);
    setLoading(false);
  }

  useEffect(() => {
    getMarksHistory();
  }, []);

  return (
    <Div>
      {loading || Object.keys(marks).length === 0 ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {loading ? (
            <div
              style={{
                width: 128,
                filter: "var(--gears)",
              }}
            >
              <Lottie animationData={gearsAnimation} loop={true} />
            </div>
          ) : (
            <Placeholder icon={<Icon56ErrorOutline />} header="Нет истории" />
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {Object.keys(marks).map((date, index) => {
            return (
              <Group
                separator="hide"
                header={
                  <Header mode="secondary">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexDirection: "row",
                      }}
                    >
                      <Icon16CalendarOutline />
                      {
                        // check if date is today
                        new Date(date).toLocaleDateString("ru-RU") ===
                        new Date().toLocaleDateString("ru-RU") ? (
                          <Text weight="1">Сегодня</Text>
                        ) : (
                          new Date(date).toLocaleDateString("ru-RU", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        )
                      }
                    </div>
                  </Header>
                }
              >
                <Card key={index} mode="outline">
                  {Object.keys(marks[date]).map((semester, index) => {
                    return (
                      <Div key={index + semester}>
                        <Headline weight="1">
                          {formatSemester(semester)}
                        </Headline>
                        <List>
                          {Object.keys(marks[date][semester]).map(
                            (subject, index) => {
                              return (
                                <Cell key={index + semester + subject}>
                                  <Subhead weight="3">
                                    {marks[date][semester][index].subject}
                                  </Subhead>
                                  <div>
                                    {Object.entries(
                                      marks[date][semester][index].modules
                                    ).map(
                                      (
                                        [
                                          module,
                                          { prev_value, next_value, operation },
                                        ],
                                        itemIndex
                                      ) => {
                                        const operationContent = () => {
                                          switch (operation) {
                                            case "UPDATE":
                                              return (
                                                <div
                                                  style={{
                                                    display: "inline-block",
                                                  }}
                                                >
                                                  <Text weight="1">
                                                    {prev_value > 0 ? (
                                                      <>
                                                        {module}:{" "}
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          {prev_value}
                                                        </span>{" "}
                                                        →{" "}
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                        >
                                                          {next_value}
                                                        </span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        {module}:{" "}
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                        >
                                                          {next_value}
                                                        </span>
                                                      </>
                                                    )}
                                                  </Text>
                                                </div>
                                              );
                                            case "CREATE":
                                              return null;
                                            case "DELETE":
                                              return null;
                                          }
                                        };

                                        return (
                                          <>
                                            {operationContent()}
                                            {/* comma if it is not the last */}

                                            {itemIndex + 1 !==
                                            Object.keys(
                                              marks[date][semester][index]
                                                .modules
                                            ).length ? (
                                              <span>, </span>
                                            ) : null}
                                          </>
                                        );
                                      }
                                    )}
                                  </div>
                                </Cell>
                              );
                            }
                          )}
                        </List>
                      </Div>
                    );
                  })}
                </Card>
              </Group>
            );
          })}
        </div>
      )}
    </Div>
  );
}
