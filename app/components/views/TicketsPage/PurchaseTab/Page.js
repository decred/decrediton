import { StakeyBounce } from "indicators";
import StakePools from "./StakePools";
import Tickets from "./Tickets";
import "style/StakePool.less";

const PurchasePage = ({
  isPurchasingTickets,
  stakePool,
  isShowingStakePools,
  onHideStakePoolConfig,
  ...props
}) => (
  (isPurchasingTickets)
    ? <StakeyBounce center/>
    : (isShowingStakePools)
      ? <StakePools {...{ onHideStakePoolConfig }} />
      : <Tickets {...{ stakePool, ...props }} />
);

export default PurchasePage;
