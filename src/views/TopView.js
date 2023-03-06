import { View, Panel, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui";
import React, { useState } from "react";
import Top from "../panels/Top";

const TopView = ({ id, onCancelClick }) => {
  return (
    <Panel id={id} separator={false}>
      <Top onCancelClick={onCancelClick} />
    </Panel>
  );
};

export default TopView;
