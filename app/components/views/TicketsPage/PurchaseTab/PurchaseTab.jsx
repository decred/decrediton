import PurchasePage from "./PurchaseTickets/PurchaseTickets";
import LEGACY_PurchasePage from "./LEGACY_PurchasePage";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import "style/StakePool.less";

function Purchase() {
  // Legacy hooks - this can be removed after stopping support vsp v1/v2.
  // vsps v3 don't need to import script to configure them.
  const [isShowingVsp, toggleShowVsp] = useState(false);
  // const [isShowingImportScript, setShowImportScript] = useState(false);
  const [isLegacy, toggleIsLegacy] = useState(true);
  const isPurchasingTickets = useSelector(sel.isPurchasingTickets);
  // end of legacy hooks

  return isLegacy ? (
    <LEGACY_PurchasePage
      {...{ isPurchasingTickets, isShowingVsp, toggleShowVsp, toggleIsLegacy }}
    />
  ) : (
    <PurchasePage {...{ toggleIsLegacy }} />
  );
}

export default Purchase;
