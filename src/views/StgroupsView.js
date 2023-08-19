import React, { Fragment, useState, useEffect } from "react";
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
} from "@vkontakte/vkui";
import { useSelector } from "react-redux";
import { api } from "../services";

const StgroupsView = ({ id, onBack, onCellClick }) => {
  const activeStgroup = useSelector((state) => state.schedule.activeStgroup);
  const [search, setSearch] = useState("");
  const [stgroups, setStgroups] = useState([]);
  const [groups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popout] = useState(null);
  const [activePanel, setActivePanel] = useState("stgroups");

  const getStgroups = async () => {
    await api.get(`/schedule/stgroup?stgroup=${search}`).then(({ data }) => {
      // remove duplicates
      const unique = [...new Set(data.map((item) => item.name))].map((name) => {
        return {
          name: name,
        };
      });
      setStgroups(unique);
    });

    setIsLoading(false);
  };

  useEffect(() => {
    getStgroups();
  }, []);

  const filterStgroups = () => {
    return stgroups

      .filter(
        ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
      )
      .slice(0, 10);
  };

  return (
    <View id={id} activePanel={activePanel} popout={popout}>
      <Panel id="stgroups">
        <PanelHeader
          left={<PanelHeaderBack onClick={onBack} />}
          separator={false}
        >
          Выбор группы
        </PanelHeader>
        {!isLoading ? (
          <Fragment>
            <FixedLayout vertical="top">
              <Search
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
                }}
              />
            </FixedLayout>

            <Group style={{ marginTop: 60 }} separator="hide">
              {filterStgroups().map((stgroup) => (
                <Cell
                  key={stgroup._id}
                  onClick={onCellClick}
                  data-stgroup={stgroup.name}
                >
                  {stgroup.name}
                </Cell>
              ))}
            </Group>
            {!search && <Footer>{stgroups.length} группы</Footer>}
          </Fragment>
        ) : (
          <PanelSpinner size="large" />
        )}
      </Panel>

      <Panel id="groups">
        <PanelHeader
          left={
            <PanelHeaderBack
              onClick={() => {
                setActivePanel("stgroups");
              }}
            />
          }
          separator={false}
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
