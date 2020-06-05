import { StakeyBounce } from "indicators";
import StakePools from "./LEGACY_StakePools";
import Tickets from "./LEGACY_Tickets";

function LEGACY_PurchasePage({
  isPurchasingTickets,
  isShowingVsp,
  toggleShowVsp,
  ...props
}) {
  return isPurchasingTickets ? (
    <StakeyBounce center />
  ) : isShowingVsp ? (
    <StakePools {...{ toggleShowVsp }} />
  ) : (
    <Tickets {...{ toggleShowVsp, ...props }} />
  );
}

export default LEGACY_PurchasePage;
