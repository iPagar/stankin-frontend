import { Fragment, useState, useEffect, MouseEventHandler } from "react";
import {
  View,
  Panel,
  PanelHeader,
  PanelSpinner,
  PanelHeaderBack,
  Cell,
  Group,
  Search,
  Footer,
  FixedLayout,
  Div,
  Separator,
} from "@vkontakte/vkui";
import { api } from "../services";
import { useAppSelector } from "../api/store";

const StgroupsView = ({
  id,
  onBack,
  onCellClick,
}: {
  id: string;
  onCellClick: MouseEventHandler<HTMLDivElement>;
  onBack: () => void;
}) => {
  const activeStgroup = useAppSelector((state) => state.schedule.activeStgroup);
  const [search, setSearch] = useState("");
  const [stgroups, setStgroups] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);
  const [groups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePanel, setActivePanel] = useState("stgroups");

  const getStgroups = async () => {
    await api.get(`/schedule/stgroup?stgroup=${search}`).then(({ data }) => {
      setStgroups(data);
    });

    setIsLoading(false);
  };

  useEffect(() => {
    getStgroups();
  }, []);

  const filterStgroups = stgroups
    .filter(({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1)
    .slice(0, 10);

  return (
    <View id={id} activePanel={activePanel}>
      <Panel id="stgroups">
        <PanelHeader before={<PanelHeaderBack onClick={onBack} />}>
          Выбор группы
        </PanelHeader>
        {!isLoading ? (
          <Fragment>
            <FixedLayout vertical="top" filled>
              <Search
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
                }}
              />
              <Separator wide />
            </FixedLayout>
            <Div>
              <Group style={{ marginTop: 60 }} separator="hide">
                {filterStgroups.length > 0 ? (
                  filterStgroups.map((stgroup) => (
                    <Cell
                      key={stgroup._id}
                      onClick={onCellClick}
                      data-stgroup={stgroup.name}
                    >
                      {stgroup.name}
                    </Cell>
                  ))
                ) : (
                  <Div>Ничего не найдено</Div>
                )}
              </Group>
            </Div>
            {!search && <Footer>{stgroups.length} группы</Footer>}
          </Fragment>
        ) : (
          <PanelSpinner size="large" />
        )}
      </Panel>

      <Panel id="groups">
        <PanelHeader
          delimiter="spacing"
          before={
            <PanelHeaderBack
              onClick={() => {
                setActivePanel("stgroups");
              }}
            />
          }
        >
          Выбор подгруппы
        </PanelHeader>

        {!isLoading ? (
          <Fragment>
            <Group separator="hide">
              {groups
                .filter((group) => group !== "Без подгруппы")
                .map((group) => (
                  <Cell
                    key={group}
                    onClick={async () => {
                      setIsLoading(true);
                      await api.put(`/schedule/favourite`, {
                        stgroup: activeStgroup,
                        group: group,
                      });
                      onBack();
                    }}
                  >
                    {group}
                  </Cell>
                ))}
            </Group>

            {!search && <Footer>{stgroups.length} группы</Footer>}
          </Fragment>
        ) : (
          <PanelSpinner size="large" />
        )}
      </Panel>
    </View>
  );
};

export default StgroupsView;
