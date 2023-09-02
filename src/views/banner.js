import { PromoBanner } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import React, { useEffect, useState } from "react";

export const Banner = () => {
  useEffect(() => {
    bridge.send("VKWebAppShowBannerAd").then((bannerInfo) => {});
  }, []);

  return null;
};
