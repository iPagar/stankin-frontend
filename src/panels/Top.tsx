import { Icon16Dropdown, Icon24Done } from "@vkontakte/icons";
import {
  Cell,
  FixedLayout,
  List,
  PanelHeaderBack,
  PanelHeaderContent,
  PanelHeaderContext,
  PanelHeaderSimple,
  Placeholder,
  Search,
  Spinner,
  Tabs,
  TabsItem,
  UsersStack,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
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
  const [hasInitialStudents, setHasInitialStudents] = useState(false);
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
      setHasInitialStudents(false);
    }
  }, [semesters]);

  useEffect(() => {
    // if context is opened, scroll to the selected semester
    if (contextOpened && selectedSemester) {
      const element = document.querySelector(
        `[data-tag="${selectedSemester}"]`
      );

      if (element) {
        element.scrollIntoView({
          block: "center",
        });
      }
    }
  }, [contextOpened, selectedSemester]);

  const [activeBottomTab, setActiveBottomTab] = useState<"rating" | "ratingst">(
    "rating"
  );

  return (
    <>
      <PanelHeaderSimple
        separator={false}
        left={<PanelHeaderBack onClick={props.onCancelClick} />}
      >
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
      </PanelHeaderSimple>
      <PanelHeaderContext
        opened={contextOpened}
        onClose={() => {
          setContextOpened(false);
        }}
        style={{
          marginTop: 0,
          zIndex: 4,
          paddingBottom: 100,
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
                asideContent={
                  selectedSemester && selectedSemester === semester ? (
                    <Icon24Done fill="var(--accent)" />
                  ) : null
                }
                onClick={async () => {
                  setSelectedSemester(semester);
                  setContextOpened(false);
                  setPage(1);
                  setStudents([]);
                  setHasMore(true);
                  setHasInitialStudents(false);
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
          {hasInitialStudents && (
            <FixedLayout vertical="top">
              <Search
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FixedLayout>
          )}
          <List
            style={{
              paddingTop: 60,
              paddingBottom: 60,
            }}
          >
            <InfiniteScroll
              loadMore={async () => {
                if (isFetching || isLoading) return;

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

                if (page === 1 && data.data.length > 0 && name === "") {
                  setHasInitialStudents(true);
                }

                setStudents([...students, ...data.data]);
              }}
              hasMore={hasMore}
            >
              {students.map((student) => (
                <TopCell
                  key={student.id}
                  student={{
                    ...student,
                  }}
                />
              ))}
            </InfiniteScroll>
            {(isFetching || isLoading) && <Spinner size={"large"} />}
            {!(isFetching || isLoading) && !hasInitialStudents && <Empty />}
            {!(isFetching || isLoading) &&
              hasInitialStudents &&
              students.length === 0 && <Placeholder>не найдено</Placeholder>}
          </List>
        </>
      )}
      {activeBottomTab === "ratingst" && (
        <>
          <List
            style={{
              paddingBottom: 60,
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
          {(ratingstFetching || ratingstLoading) && <Spinner size={"large"} />}
          {!(ratingstFetching || ratingstLoading) && ratingst?.length === 0 && (
            <Empty />
          )}
          {ratingstFetching || ratingstLoading ? (
            <Spinner size={"large"} />
          ) : null}
        </>
      )}
      {hasInitialStudents && (
        <FixedLayout
          vertical="bottom"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {activeBottomTab === "rating" && myRating && myRating.number && (
            <UsersStack
              style={{
                position: "fixed",
                bottom: "calc(var(--tabbar_height) * 2)",
                background: "var(--background_content)",
                width: "100%",
              }}
              photos={[myRating.photo ? myRating.photo : ""]}
            >
              {`Вы на ${myRating.number} месте`}
            </UsersStack>
          )}
          {me && (
            <Tabs>
              <TabsItem
                onClick={
                  activeBottomTab === "rating"
                    ? () => setActiveBottomTab("ratingst")
                    : () => setActiveBottomTab("rating")
                }
                selected={activeBottomTab === "rating"}
              >
                Станкин
              </TabsItem>

              <TabsItem
                onClick={
                  activeBottomTab === "ratingst"
                    ? () => setActiveBottomTab("rating")
                    : () => setActiveBottomTab("ratingst")
                }
                selected={activeBottomTab === "ratingst"}
              >
                {`${me.stgroup}`}
              </TabsItem>
            </Tabs>
          )}
        </FixedLayout>
      )}
    </>
  );
}
