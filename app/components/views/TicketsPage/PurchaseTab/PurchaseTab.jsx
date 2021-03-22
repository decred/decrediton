import PurchasePage from "./PurchaseTickets/PurchaseTickets";
import LEGACY_PurchasePage from "./LEGACY_PurchasePage";
import { useState } from "react";
import { usePurchaseTab } from "./hooks";

function Purchase() {
  // Legacy hooks - this can be removed after stopping support vsp v1/v2.
  // vsps v3 don't need to import script to configure them.
  const [isShowingVsp, toggleShowVsp] = useState(false);
  const { isLegacy, toggleIsLegacy } = usePurchaseTab();

  return isLegacy ? (
    <LEGACY_PurchasePage {...{ isShowingVsp, toggleShowVsp, toggleIsLegacy }} />
  ) : (
    <PurchasePage {...{ toggleIsLegacy }} />
  );
}

export default Purchase;
