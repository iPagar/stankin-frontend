import React, { Fragment } from "react";
import {
  ModalRoot,
  ModalPageHeader,
  usePlatform,
  ModalPage,
  PanelHeaderButton,
  SelectMimicry,
  FormLayoutGroup,
  Div,
  Group,
  FormItem,
} from "@vkontakte/vkui";
import { api } from "../services";
import { Icon24Cancel, Icon24Done } from "@vkontakte/icons";
import { useAppDispatch, useAppSelector } from "../api/store";
import { setView } from "../api/slices/config.slice";

const ScheduleSettings = ({
  onSettingsClose,
  activeModal,
}: {
  onSettingsClose: () => void;
  activeModal: string | null;
}) => {
  const platform = usePlatform();
  const stgroup = useAppSelector((state) => state.schedule.stgroup);
  const group = useAppSelector((state) => state.schedule.group);
  const dispatch = useAppDispatch();

  const onSuccess = async () => {
    if (stgroup && group) {
      await api.put(`/schedule/favourite`, { stgroup, group });
    }

    onSettingsClose();
  };

  return (
    <ModalRoot activeModal={activeModal} onClose={onSuccess}>
      <ModalPage
        id="select"
        header={
          <ModalPageHeader
            before={
              <Fragment>
                {platform === "android" && (
                  <PanelHeaderButton onClick={onSuccess}>
                    <Icon24Cancel />
                  </PanelHeaderButton>
                )}
              </Fragment>
            }
            after={
              <Fragment>
                {platform === "android" && (
                  <PanelHeaderButton onClick={onSuccess}>
                    <Icon24Done />
                  </PanelHeaderButton>
                )}
                {platform === "ios" && (
                  <PanelHeaderButton onClick={onSuccess}>
                    Готово
                  </PanelHeaderButton>
                )}
              </Fragment>
            }
            onClick={onSuccess}
          >
            Выбор расписания
          </ModalPageHeader>
        }
      >
        <Group>
          <FormLayoutGroup>
            <FormItem>
              <SelectMimicry
                placeholder={!stgroup ? "Не выбрана" : stgroup}
                onClick={() => dispatch(setView("stgroupsView"))}
              />
            </FormItem>
            <FormItem>
              <SelectMimicry
                placeholder={!group ? "Не выбрана" : group}
                onClick={() => dispatch(setView("groupsView"))}
                disabled={!stgroup ? true : false}
              />
            </FormItem>
          </FormLayoutGroup>
        </Group>
      </ModalPage>
    </ModalRoot>
  );
};

export default ScheduleSettings;
