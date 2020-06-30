import { StakeyBounce } from "indicators";
import StakePools from "./LEGACY_StakePools/StakePoolsList";
import Tickets from "./LEGACY_Tickets";
// after stop supporting old vsp code, we can remove this connector
import { purchaseTickets } from "connectors";

function LEGACY_PurchasePage({
  isPurchasingTickets,
  isShowingVsp,
  toggleShowVsp,
  ...props
}) {
  return isPurchasingTickets ? (
    <StakeyBounce center />
  ) : isShowingVsp ? (
    <StakePools {...{ toggleShowVsp, ...props }} />
  ) : (
    <Tickets {...{ toggleShowVsp, ...props }} />
  );
}

export default purchaseTickets(LEGACY_PurchasePage);
