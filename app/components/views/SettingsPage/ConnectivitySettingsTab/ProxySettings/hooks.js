import { useState } from "react";

export const useProxySettings = (tempSettings) => {
  const [proxyType, setProxyType] = useState(tempSettings.proxyType);
  const [proxyLocation, setProxyLocation] = useState(
    tempSettings.proxyLocation
  );

  return {
    proxyType,
    proxyLocation,
    setProxyType,
    setProxyLocation
  };
};
