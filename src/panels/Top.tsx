import { Icon16Dropdown, Icon24Done } from "@vkontakte/icons";
import {
  Cell,
  FixedLayout,
  List,
  PanelHeaderBack,
  PanelHeaderContent,
  PanelHeaderContext,
  PanelHeader,
  Placeholder,
  Search,
  Spinner,
  Tabs,
  TabsItem,
  UsersStack,
  Group,
  Separator,
  Div,
} from "@vkontakte/vkui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppControllerGetSemestersQuery } from "../api/slices/app.slice";
import {
  StudentRatingDto,
  useLazyStudentsControllerGetRatingQuery,
  useStudentsControllerGetMeQuery,
  useStudentsControllerGetMeRatingQuery,
  useStudentsControllerGetRatingstQuery,
} from "../api/slices/students.slice";
import TopCell from "./TopCell";
import InfiniteScroll from "react-infinite-scroller";
import useDebounce from "../services/useDebounce";
import Empty from "./Empty";

const semesterFormat = (semester: string) => {
  if (semester.length !== 10) return semester;

  return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
};

export default function TopList(props: { onCancelClick: () => void }) {
  const [contextOpened, setContextOpened] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const { data: semesters, isLoading: semestersLoading } =
    useAppControllerGetSemestersQuery();
  const [getStudents, { isLoading, isFetching }] =
    useLazyStudentsControllerGetRatingQuery();
  const [students, setStudents] = useState<StudentRatingDto[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 500);
  const { data: myRating } = useStudentsControllerGetMeRatingQuery({
    semester: selectedSemester,
  });
  const { data: me } = useStudentsControllerGetMeQuery();
  const {
    data: ratingst,
    isLoading: ratingstLoading,
    isFetching: ratingstFetching,
  } = useStudentsControllerGetRatingstQuery({
    semester: selectedSemester,
  });
  const [scrollPosition, setScrollPosition] = useState(0);

  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    setPage(1);
    setStudents([]);
    setHasMore(true);
  }, [debouncedName]);

  useEffect(() => {
    if (semesters) {
      setSelectedSemester(semesters[semesters.length - 1]);
      setPage(1);
      setStudents([]);
      setHasMore(true);
    }
  }, [semesters]);

  useEffect(() => {
    // if context is opened, scroll to the selected semester
    if (contextOpened && selectedSemester) {
      setTimeout(() => {
        const element = document.querySelector(
          `[data-tag="${selectedSemester}"]`
        );

        if (element) {
          element.scrollIntoView({
            block: "center",
          });
        }
      }, 0);
    }
  }, [contextOpened, selectedSemester]);

  const [activeBottomTab, setActiveBottomTab] = useState<"rating" | "ratingst">(
    "rating"
  );

  useEffect(() => {
    if (activeBottomTab === "rating") {
      window.scrollTo(0, scrollPosition);
    }
  }, [activeBottomTab]);

  return (
    <>
      <PanelHeader before={<PanelHeaderBack onClick={props.onCancelClick} />}>
        <PanelHeaderContent
          aside={
            <Icon16Dropdown
              style={{
                transform: `rotate(${contextOpened ? "180deg" : "0"})`,
                transition: "transform 0.15s ease-in-out",
                opacity: semestersLoading ? 0 : 1,
              }}
            />
          }
          onClick={() => {
            if (!semestersLoading) {
              setContextOpened(!contextOpened);
            }
          }}
          before={undefined}
          status={undefined}
        >
          {semestersLoading && <Spinner size="small" />}
          {!semestersLoading && semesterFormat(selectedSemester)}
        </PanelHeaderContent>
      </PanelHeader>

      <PanelHeaderContext
        opened={contextOpened}
        onClose={() => {
          setContextOpened(false);
        }}
        style={{
          marginTop: 0,
          zIndex: 4,
        }}
      >
        <div
          style={{
            marginTop: 0,
          }}
          onClick={() => {
            setContextOpened(false);
          }}
        >
          <List
            style={{
              height: 300,
              overflow: "auto",
            }}
          >
            {semesters?.map((semester, i) => (
              <Cell
                key={i}
                data-tag={semester}
                after={
                  selectedSemester && selectedSemester === semester ? (
                    <Icon24Done fill="var(--accent)" />
                  ) : null
                }
                onClick={() => {
                  setSelectedSemester(semester);
                  setContextOpened(false);
                  setPage(1);
                  setStudents([]);
                  setHasMore(true);
                }}
              >
                {semesterFormat(semester)}
              </Cell>
            ))}
          </List>
        </div>
      </PanelHeaderContext>
      {activeBottomTab === "rating" && (
        <>
          {(students.length > 0 ||
            (students.length === 0 && debouncedName !== "")) && (
            <FixedLayout vertical="top" filled>
              <Search
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Separator wide />
            </FixedLayout>
          )}

          <Div>
            <InfiniteScroll
              loadMore={async () => {
                if (isFetching || isLoading || !selectedSemester) return;

                const data = await getStudents({
                  page,
                  limit: 20,
                  semester: selectedSemester,
                  search: name,
                }).unwrap();

                if (students.length + data.data.length < data.total) {
                  setPage(page + 1);
                } else {
                  setHasMore(false);
                }

                setStudents([...students, ...data.data]);
              }}
              hasMore={hasMore}
            >
              <List
                style={{
                  paddingTop: 60,
                  paddingBottom: 60,
                  gap: 8,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {students.map((student) => (
                  <TopCell
                    key={student.id}
                    student={{
                      ...student,
                    }}
                  />
                ))}
              </List>
            </InfiniteScroll>
            {(isFetching || isLoading) && <Spinner size={"large"} />}
            {!(isFetching || isLoading) && students.length === 0 && <Empty />}
          </Div>
        </>
      )}
      {activeBottomTab === "ratingst" && (
        <>
          <Div>
            <List
              style={{
                paddingTop: 60,
                paddingBottom: 60,
                gap: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {ratingst?.map((student) => (
                <TopCell
                  key={student.id}
                  student={{
                    ...student,
                    stgroup: null,
                  }}
                />
              ))}
            </List>
          </Div>
          {(isFetching || isLoading) && <Spinner size={"large"} />}
          {!(isFetching || isLoading) && ratingst?.length === 0 && <Empty />}
        </>
      )}
      <FixedLayout
        vertical="bottom"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        filled
      >
        {activeBottomTab === "rating" && myRating && myRating.number && (
          <Div
            style={{
              zIndex: 1,
            }}
          >
            <UsersStack
              style={{
                marginBottom: 10,
              }}
              photos={[myRating.photo ? myRating.photo : ""]}
            >
              {`Вы на ${myRating.number} месте`}
            </UsersStack>
            <Separator wide />
          </Div>
        )}
        {me && me.stgroup && (
          <Tabs>
            <TabsItem
              onClick={() => {
                setActiveBottomTab("rating");
              }}
              selected={activeBottomTab === "rating"}
              aria-label="Станкин"
            >
              Станкин
            </TabsItem>

            <TabsItem
              onClick={() => {
                saveScrollPosition();
                setActiveBottomTab("ratingst");
              }}
              selected={activeBottomTab === "ratingst"}
              aria-label={me.stgroup as unknown as string}
            >
              {`${me.stgroup}`}
            </TabsItem>
          </Tabs>
        )}
      </FixedLayout>
    </>
  );
}
