import React from "react";
import ReactToolTip from "react-tooltip";
import StakeyBounce from "../../StakeyBounce";
import SideBar from "../../SideBar";
import PurchaseTicketsInfo from "../../PurchaseTicketsInfo";
import VotingPrefs from "../../VotingPrefs";
import StakePools from "../../StakePools";
import TicketsPageHeader from "./Header";
import Tickets from "./Tickets";
import "../../../style/StakePool.less";

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
  ...props
}) => (
  <div className="stakepool-body">
    <SideBar />
    <div className="stakepool-view">
      <TicketsPageHeader {...{ onToggleTicketStakePool }} />
      {(isSavingStakePoolConfig || isPurchasingTickets)
        ? <div className="stakepool-content"><StakeyBounce/></div>
        : (isShowingStakePools)
          ? <StakePools {...{ onHideStakePoolConfig }} />
          : isShowingVotingPrefs
            ? <VotingPrefs />
            : isShowingTicketsInfo
              ? <PurchaseTicketsInfo closeModal={onHideTicketsInfo} />
              : <Tickets {...{ stakePool, ...props }} />
      }
    </div>
    <ReactToolTip type="info" effect="solid"/>
  </div>
);

export default TicketsPage;
