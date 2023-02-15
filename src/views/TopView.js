import { View, Panel, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui";
import React, { useState } from "react";
import Top from "../panels/Top";

const TopView = ({ id }) => {
  return (
    <View id={id} activePanel="top">
      <Panel id="top" separator={false}>
        <Top />
      </Panel>
    </View>
  );
};

export default TopView;
