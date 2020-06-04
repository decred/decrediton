import { substruct, compose, eq, get } from "fp";
import PurchasePage from "./Page";
import { FormattedMessage as T } from "react-intl";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { StakeyBounce } from "indicators";
import StakePools from "./LEGACY_StakePools";
import Tickets from "./LEGACY_Tickets";
import "style/StakePool.less";

function Purchase ({ props }) {
  // Legacy hooks - this can be removed after stopping support vsp v1/v2.
  // vsps v3 don't need to import script of configure them.
  const [isShowingImportScript, setShowImportScript] = useState(false);
  const [isShowingVsp, toggleShowVsp] = useState(false);
  const [isLegacy, setIsLegacy] = useState(true);
  const isPurchasingTickets = useSelector(sel.isPurchasingTickets);
  // end of legacy hooks

  return (
    isLegacy ? (
      isPurchasingTickets ? (
        <StakeyBounce center />
      ) : isShowingVsp ? <StakePools {...{ toggleShowVsp }} />
        : <Tickets {...{ toggleShowVsp, ...props }} />
    ) :
    <PurchasePage {...{ ...props, isShowingVsp, isShowingImportScript, toggleShowVsp }} />
  );
}

export default Purchase;
