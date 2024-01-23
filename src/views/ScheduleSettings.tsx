import React, { Fragment } from "react";
import {
  ModalRoot,
  ModalPageHeader,
  ANDROID,
  IOS,
  usePlatform,
  ModalPage,
  PanelHeaderButton,
  SelectMimicry,
  FormLayout,
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
            left={
              <Fragment>
                {platform === ANDROID && (
                  <PanelHeaderButton onClick={onSuccess}>
                    <Icon24Cancel />
                  </PanelHeaderButton>
                )}
              </Fragment>
            }
            right={
              <Fragment>
                {platform === ANDROID && (
                  <PanelHeaderButton onClick={onSuccess}>
                    <Icon24Done />
                  </PanelHeaderButton>
                )}
                {platform === IOS && (
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
        {
          <FormLayout>
            <SelectMimicry
              top="Выберите группу"
              placeholder={!stgroup ? "Не выбрана" : stgroup}
              onClick={() => dispatch(setView("stgroupsView"))}
            />
            <SelectMimicry
              top="Выберите подгруппу"
              placeholder={!group ? "Не выбрана" : group}
              onClick={() => dispatch(setView("groupsView"))}
              disabled={!stgroup ? true : false}
            />
          </FormLayout>
        }
      </ModalPage>
    </ModalRoot>
  );
};

export default ScheduleSettings;
