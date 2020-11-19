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
import { useDispatch, useSelector } from "react-redux";
import { api } from "../services";
import { setStory } from "../redux/actions";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Done from "@vkontakte/icons/dist/24/done";

const ScheduleSettings = ({ activeModal, onSettingsClose }) => {
  const platform = usePlatform();
  const stgroup = useSelector((state) => state.schedule.activeStgroup);
  const group = useSelector((state) => state.schedule.activeGroup);
  const dispatch = useDispatch();

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
        onClose={onSuccess}
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
          >
            Настройки
          </ModalPageHeader>
        }
      >
        <FormLayout>
          <SelectMimicry
            top="Выберите группу"
            placeholder={!stgroup ? "Не выбрана" : stgroup}
            onClick={() => dispatch(setStory("stgroupsView"))}
          />
          <SelectMimicry
            top="Выберите подгруппу"
            placeholder={!group ? "Не выбрана" : group}
            onClick={() => dispatch(setStory("groupsView"))}
            disabled={!stgroup ? true : false}
          />
        </FormLayout>
      </ModalPage>
    </ModalRoot>
  );
};

export default ScheduleSettings;
