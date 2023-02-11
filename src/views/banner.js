import { PromoBanner } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import React, { useEffect, useState } from "react";

export const Banner = () => {
  const [bannerData, setBannerData] = useState({});

  useEffect(() => {
    bridge.send("VKWebAppGetAds").then((bannerInfo) => {
      setBannerData(bannerInfo);
    });
  }, []);

  if (!bannerData) {
    return null;
  }

  return (
    <PromoBanner
      bannerData={bannerData}
      onClose={() => {
        setBannerData(null);
      }}
    />
  );
};
