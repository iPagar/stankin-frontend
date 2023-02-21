import bridge from "@vkontakte/vk-bridge";
import React, { useEffect } from "react";

export const Banner = () => {
  useEffect(() => {
    bridge.send("VKWebAppShowBannerAd", {
      banner_location: "bottom",
    });
  }, []);

  return <></>;
};
