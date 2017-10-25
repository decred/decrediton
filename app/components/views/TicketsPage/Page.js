import StakeyBounce from "../../StakeyBounce";
import PurchaseTicketsInfo from "../../PurchaseTicketsInfo";
import TicketAutoBuyerInfo from "../../TicketAutoBuyerInfo";
import VotingPrefs from "../../VotingPrefs";
import StakePools from "../../StakePools";
import TicketsPageHeader from "./Header";
import Tickets from "./Tickets";
import "style/Layout.less";
import "style/StakePool.less";

const TicketsPage = ({
  isSavingStakePoolConfig,
  isPurchasingTickets,
  stakePool,
  isShowingVotingPrefs,
  isShowingTicketsInfo,
  isShowingStakePools,
  onToggleTicketStakePool,
  onHideTicketsInfo,
  onHideStakePoolConfig,
  isShowingAutoBuyerTicketsInfo,
  onHideAutoBuyerTicketsInfo,
  ...props
}) => (
  <Aux>
    <TicketsPageHeader {...{ onToggleTicketStakePool }} />
    {(isSavingStakePoolConfig || isPurchasingTickets)
      ? <div className="page-content"><StakeyBounce/></div>
      : (isShowingStakePools)
        ? <StakePools {...{ onHideStakePoolConfig }} />
        : isShowingVotingPrefs
          ? <VotingPrefs />
          : isShowingTicketsInfo
            ? <PurchaseTicketsInfo closeModal={onHideTicketsInfo} />
              : isShowingAutoBuyerTicketsInfo ? <TicketAutoBuyerInfo closeModal={onHideAutoBuyerTicketsInfo} />
                : <Tickets {...{ stakePool, ...props }} />
    }
  </Aux>
);

export default TicketsPage;
