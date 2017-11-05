import StakeyBounce from "StakeyBounce";
import PurchaseTicketsInfo from "PurchaseTicketsInfo";
import TicketAutoBuyerInfo from "TicketAutoBuyerInfo";
import StakePools from "StakePools";
import Tickets from "./Tickets";
import "style/StakePool.less";

const PurchasePage = ({
  isSavingStakePoolConfig,
  isPurchasingTickets,
  stakePool,
  isShowingTicketsInfo,
  isShowingStakePools,
  isShowingAutoBuyerTicketsInfo,
  onHideTicketsInfo,
  onHideStakePoolConfig,
  onHideAutoBuyerTicketsInfo,
  ...props
}) => (
    (isSavingStakePoolConfig || isPurchasingTickets)
      ? <StakeyBounce/>
      : (isShowingStakePools)
        ? <StakePools {...{ onHideStakePoolConfig }} />
          : isShowingTicketsInfo
            ? <PurchaseTicketsInfo closeModal={onHideTicketsInfo} />
            : isShowingAutoBuyerTicketsInfo
              ? <TicketAutoBuyerInfo closeModal={onHideAutoBuyerTicketsInfo} />
                : <Tickets {...{ stakePool, ...props }} />
);

export default PurchasePage;
