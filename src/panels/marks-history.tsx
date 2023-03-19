import {
  Card,
  Cell,
  Div,
  Group,
  Header,
  Headline,
  List,
  Subhead,
  Text,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { api } from "../services";
import { Icon16CalendarOutline } from "@vkontakte/icons";
import { format } from "date-fns";
import Lottie from "lottie-react";
import gearsAnimation from "../assets/gears.json";

const marksHistoryMock: Mark[] = [
  {
    semester: "2021-весна",
    subject: "Математика",
    module: "М2",
    prev_value: 0,
    next_value: 50,
    operation: "UPDATE",
    created_at: new Date().toString(),
  },
  {
    semester: "2017-весна",
    subject: "Математика",
    module: "М1",
    prev_value: 25,
    next_value: 50,
    operation: "UPDATE",
    created_at: "2023-03-10T10:47:14.390Z",
  },
  {
    semester: "2017-весна",
    subject: "Математика",
    module: "З",
    prev_value: 25,
    next_value: 50,
    operation: "UPDATE",
    created_at: "2023-03-08T10:47:14.390Z",
  },
  {
    semester: "2017-весна",
    subject: "Математика",
    module: "М2",
    prev_value: 25,
    next_value: 50,
    operation: "UPDATE",
    created_at: "2023-03-08T10:47:14.390Z",
  },
  {
    semester: "2017-осень",
    subject: "Математика",
    module: "М1",
    prev_value: 25,
    next_value: 50,
    operation: "UPDATE",
    created_at: "2023-03-08T10:47:14.390Z",
  },
  {
    semester: "2017-осень",
    subject: "Математика",
    module: "М2",
    prev_value: 25,
    next_value: 50,
    operation: "UPDATE",
    created_at: "2023-02-05T10:47:14.390Z",
  },
];

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
  const [isTesting, setIsTesting] = useState(false);

  async function getMarksHistory() {
    const response = await api.get<Mark[]>("/marks/history");

    if (response.data.length === 0) {
      setIsTesting(true);
      response.data = marksHistoryMock;
    }
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

    // testing purposes
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    getMarksHistory();
  }, []);

  return (
    <Div>
      {loading ? (
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
          <div
            style={{
              width: 128,
              filter: "var(--gears)",
            }}
          >
            <Lottie animationData={gearsAnimation} loop={true} />
          </div>
        </div>
      ) : (
        <div>
          {isTesting && (
            <Text weight={"regular"} style={{ color: "var(--text_secondary)" }}>
              Тестовые данные
            </Text>
          )}
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
                          <Text weight={"regular"}>Сегодня</Text>
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
                        <Headline weight={"regular"}>
                          {formatSemester(semester)}
                        </Headline>
                        <List>
                          {Object.keys(marks[date][semester]).map(
                            (subject, index) => {
                              return (
                                <Cell key={index + semester + subject}>
                                  <Subhead weight={"bold"}>
                                    {marks[date][semester][index].subject}
                                  </Subhead>
                                  {Object.entries(
                                    marks[date][semester][index].modules
                                  ).map(
                                    ([
                                      module,
                                      { prev_value, next_value, operation },
                                    ]) => {
                                      const operationContent = () => {
                                        switch (operation) {
                                          case "UPDATE":
                                            return (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 8,
                                                }}
                                              >
                                                <Text weight={"regular"}>
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

                                      return operationContent();
                                    }
                                  )}
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
