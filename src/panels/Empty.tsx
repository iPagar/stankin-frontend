import React, { Component } from "react";
import { Placeholder } from "@vkontakte/vkui";

import { Icon56HistoryOutline } from "@vkontakte/icons";

function Empty() {
  return (
    <Placeholder icon={<Icon56HistoryOutline />} stretched>
      Пусто
    </Placeholder>
  );
}

export default Empty;
