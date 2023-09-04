import { PromoBanner } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import React, { useEffect, useState } from "react";

export const Banner = () => {
  useEffect(() => {
    bridge
      .send("VKWebAppShowBannerAd")
      .then((bannerInfo) => {
        console.log(bannerInfo, 4);
      })
      .catch((error) => {
        console.log(error, 5);
      });
  }, []);

  return null;
};
