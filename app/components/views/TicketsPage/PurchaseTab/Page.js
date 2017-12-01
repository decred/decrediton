import StakeyBounce from "StakeyBounce";
import StakePools from "StakePools";
import Tickets from "./Tickets";
import "style/StakePool.less";

const PurchasePage = ({
  isSavingStakePoolConfig,
  isPurchasingTickets,
  stakePool,
  isShowingStakePools,
  onHideStakePoolConfig,
  ...props
}) => (
    (isSavingStakePoolConfig || isPurchasingTickets)
      ? <StakeyBounce/>
      : (isShowingStakePools)
        ? <StakePools {...{ onHideStakePoolConfig }} />
          : <Tickets {...{ stakePool, ...props }} />
);

export default PurchasePage;
