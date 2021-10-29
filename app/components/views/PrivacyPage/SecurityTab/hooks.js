import { useState } from "react";

export function useSecurityTab() {
  const [sideActive, setSideActive] = useState(true);

  return {
    sideActive,
    setSideActive
  };
}
