import MyTickets from "./MyTickets/MyTickets";
import MyVSPTicket from "./MyVSPTickets/MyVSPTickets";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import "style/StakePool.less";
import { useMyTicketsTab } from "./hooks";

function Purchase() {
  // Legacy hooks - this can be removed after stopping support vsp v1/v2.
  // vsps v3 don't need to import script to configure them.
  const [isShowingVsp, toggleShowVsp] = useState(false);
  // const [isShowingImportScript, setShowImportScript] = useState(false);
  const { isLegacy, toggleIsLegacy } = useMyTicketsTab();
  const isPurchasingTickets = useSelector(sel.isPurchasingTickets);
  // end of legacy hooks

  return !isLegacy ? <MyVSPTicket {...{ toggleIsLegacy }} /> : (
    <MyTickets
      {...{ isPurchasingTickets, isShowingVsp, toggleShowVsp, toggleIsLegacy }}
    />
  );
}

export default Purchase;
