import bridge from "@vkontakte/vk-bridge";
import { useEffect } from "react";

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
