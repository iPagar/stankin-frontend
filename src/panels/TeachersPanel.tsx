import { useState, useEffect } from "react";
import {
  Panel,
  PanelHeader,
  Group,
  PanelHeaderBack,
  Search,
  CardGrid,
  FixedLayout,
  Spinner,
  PullToRefresh,
} from "@vkontakte/vkui";
import useDebounce from "../services/useDebounce";
import TeacherCard from "../cells/TeacherCard";
import InfiniteScroll from "react-infinite-scroller";
import { useAppDispatch, useAppSelector } from "../api/store";
import { useLazyTeachersControllerGetTeachersQuery } from "../api/slices/teachers.enhanced";
import { TeacherDto } from "../api/slices/teachers.slice";
import { setSearchTeacher } from "../api/slices/burger.slice";

const TeachersPanel = ({
  id,
  onCancelClick,
}: {
  id: string;
  onCancelClick: () => void;
}) => {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [getTeachers, { isLoading, isFetching }] =
    useLazyTeachersControllerGetTeachersQuery();

  const name = useAppSelector((state) => state.burger.searchTeacher);
  const [page, setPage] = useState(1);
  const snackbar = useAppSelector((state) => state.burger.snackbar);
  const debouncedName = useDebounce(name, 500);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPage(1);
    setTeachers([]);
    setHasMore(true);
  }, [debouncedName]);

  return (
    <Panel id={id}>
      <PanelHeader
        separator={false}
        left={<PanelHeaderBack onClick={onCancelClick} />}
      >
        Преподаватели
      </PanelHeader>
      <FixedLayout vertical="top">
        <Search
          value={name}
          onChange={(e) => {
            dispatch(setSearchTeacher(e.target.value));
          }}
        />
      </FixedLayout>

      <PullToRefresh
        style={{ marginTop: 60, marginBottom: 10 }}
        onRefresh={async () => {
          const data = await getTeachers({
            page: 1,
            name,
          }).unwrap();
          if (data.data.length < data.total) {
            setHasMore(true);
            setPage(2);
          }
          setTeachers(data.data);
        }}
        isFetching={isFetching}
      >
        <Group separator="hide">
          <CardGrid>
            {!(isFetching || isLoading) && teachers.length === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  marginTop: 20,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>
                  Ничего не найдено
                </div>
                <div style={{ fontSize: 16 }}>Попробуйте изменить запрос</div>
              </div>
            )}
            {teachers && (
              <InfiniteScroll
                loadMore={async () => {
                  if (isFetching || isLoading) return;

                  const data = await getTeachers({
                    page,
                    name,
                  }).unwrap();

                  if (teachers.length + data.data.length < data.total) {
                    setPage(page + 1);
                  } else {
                    setHasMore(false);
                  }

                  setTeachers([...teachers, ...data.data]);
                }}
                hasMore={hasMore}
                loader={
                  <div key={0} style={{ paddingTop: 20 }}>
                    <Spinner size={"large"} />
                  </div>
                }
              >
                {teachers?.map((teacher) => (
                  <TeacherCard key={teacher.name} teacher={teacher} />
                ))}
              </InfiniteScroll>
            )}
          </CardGrid>
        </Group>
      </PullToRefresh>
      {snackbar}
    </Panel>
  );
};

export default TeachersPanel;
