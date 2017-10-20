import StakeyBounce from "../../StakeyBounce";
import PurchaseTicketsInfo from "../../PurchaseTicketsInfo";
import StakePools from "../../StakePools";
import TicketsPageHeader from "./Header";
import Tickets from "./Tickets";
import "style/Layout.less";
import "style/StakePool.less";

const TicketsPage = ({
  isSavingStakePoolConfig,
  isPurchasingTickets,
  stakePool,
  isShowingTicketsInfo,
  isShowingStakePools,
  onToggleTicketStakePool,
  onHideTicketsInfo,
  onHideStakePoolConfig,
  ...props
}) => (
  <Aux>
    <TicketsPageHeader {...{ onToggleTicketStakePool }} />
    {(isSavingStakePoolConfig || isPurchasingTickets)
      ? <div className="page-content"><StakeyBounce/></div>
      : (isShowingStakePools)
        ? <StakePools {...{ onHideStakePoolConfig }} />
          : isShowingTicketsInfo
            ? <PurchaseTicketsInfo closeModal={onHideTicketsInfo} />
            : <Tickets {...{ stakePool, ...props }} />
    }
  </Aux>
);

export default TicketsPage;
