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
import { setView } from "../redux/actions";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Done from "@vkontakte/icons/dist/24/done";

const ScheduleSettings = ({ onSettingsClose, activeModal }) => {
  const platform = usePlatform();
  const stgroup = useSelector((state) => state.schedule.stgroup);
  const group = useSelector((state) => state.schedule.group);
  const dispatch = useDispatch();

  const onSuccess = async () => {
    if (stgroup && group) {
      await api.put(`/schedule/favourite`, { stgroup, group });
    }

    onSettingsClose();
  };

  return (
    <ModalRoot
      activeModal={activeModal}
      onClose={onSuccess}
      dynamicContentHeight
      settlingHeight={100}
    >
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
