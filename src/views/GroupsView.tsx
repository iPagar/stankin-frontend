import React, { useState, useEffect } from "react";
import {
  View,
  Panel,
  PanelHeader,
  PanelSpinner,
  PanelHeaderBack,
  Cell,
  Group,
  Div,
} from "@vkontakte/vkui";
import { api } from "../services";
import { useAppSelector } from "../api/store";

const GroupsView = ({
  id,
  onBack,
  onCellClick,
}: {
  id: string;
  onBack: () => void;
  onCellClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  const [groups, setGroups] = useState<string[]>([]);
  const stgroup = useAppSelector((state) => state.schedule.stgroup);
  const [isLoading, setIsLoading] = useState(true);

  const getGroups = async () => {
    await api.get(`/schedule/groups?stgroup=${stgroup}`).then(({ data }) => {
      setGroups(data);
    });

    setIsLoading(false);
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <View id={id} activePanel="main">
      <Panel id="main">
        <PanelHeader
          delimiter="spacing"
          before={<PanelHeaderBack onClick={onBack} />}
        >
          Выбор подгруппы
        </PanelHeader>
        <Div>
          {!isLoading ? (
            <Group>
              {groups.length > 1 ? (
                groups
                  .filter((group) => group !== "Без подгруппы")
                  .map((group) => (
                    <Cell
                      key={group}
                      onClick={async (e) => {
                        setIsLoading(true);

                        onCellClick(e);
                      }}
                      data-group={group}
                      data-stgroup={stgroup}
                    >
                      {group}
                    </Cell>
                  ))
              ) : (
                <Cell
                  onClick={async (e) => {
                    setIsLoading(true);

                    onCellClick(e);
                  }}
                  data-group={groups[0]}
                  data-stgroup={stgroup}
                >
                  {groups[0]}
                </Cell>
              )}
            </Group>
          ) : (
            <PanelSpinner size="large" />
          )}
        </Div>
      </Panel>
    </View>
  );
};

export default GroupsView;
