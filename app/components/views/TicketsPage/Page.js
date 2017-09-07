import React from "react";
import ReactToolTip from "react-tooltip";
import StakeyBounce from "../../StakeyBounce";
import SideBar from "../../SideBar";
import PurchaseTicketsInfo from "../../PurchaseTicketsInfo";
import VotingPrefs from "../../VotingPrefs";
import StakePools from "../../StakePools";
import TicketsPageHeader from "./Header";
import Tickets from "./Tickets";
import { StakePoolStyles } from "../ViewStyles";

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
  <div style={StakePoolStyles.body}>
    <SideBar />
    <div style={StakePoolStyles.view}>
      <TicketsPageHeader {...{ onToggleTicketStakePool }} />
      {(isSavingStakePoolConfig || isPurchasingTickets)
        ? <div style={StakePoolStyles.content}><StakeyBounce/></div>
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
