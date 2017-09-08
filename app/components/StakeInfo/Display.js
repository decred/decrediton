import React from "react";
import { StakePoolStyles } from "../views/ViewStyles";
import TicketsCogs from "../TicketsCogs";

const StakeInfoDisplay = ({
  isShowingDetails,
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  ownMempoolTicketsCount,
  revokedTicketsCount,
  immatureTicketsCount,
  expiredTicketsCount,
  liveTicketsCount,
  onHideStakeInfo,
  onShowStakeInfo
}) => isShowingDetails ? (
  <div style={StakePoolStyles.stakeInfoArea}>
    <div style={StakePoolStyles.stakeInfoRow}>
      <div style={StakePoolStyles.stakeInfoRowLeft}>
        <div style={StakePoolStyles.stakeInfoLabel}>Poolsize:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{ticketPoolSize}</div>
      </div>
      <div style={StakePoolStyles.stakeInfoRowRight}>
        <div style={StakePoolStyles.stakeInfoLabel}>Voted Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{votedTicketsCount}</div>
        <TicketsCogs
          opened={!isShowingDetails}
          style={{paddingTop: "2px"}}
          onClick={onHideStakeInfo}
        />
      </div>
    </div>
    <div style={StakePoolStyles.stakeInfoRow}>
      <div style={StakePoolStyles.stakeInfoRowLeft}>
        <div style={StakePoolStyles.stakeInfoLabel}>All Mempool Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{allMempoolTicketsCount}</div>
      </div>
      <div style={StakePoolStyles.stakeInfoRowRight}>
        <div style={StakePoolStyles.stakeInfoLabel}>Missed Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{missedTicketsCount}</div>
      </div>
    </div>
    <div style={StakePoolStyles.stakeInfoRow}>
      <div style={StakePoolStyles.stakeInfoRowLeft}>
        <div style={StakePoolStyles.stakeInfoLabel}>Own Mempool Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{ownMempoolTicketsCount}</div>
      </div>
      <div style={StakePoolStyles.stakeInfoRowRight}>
        <div style={StakePoolStyles.stakeInfoLabel}>Revoked Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{revokedTicketsCount}</div>
      </div>
    </div>
    <div style={StakePoolStyles.stakeInfoRow}>
      <div style={StakePoolStyles.stakeInfoRowLeft}>
        <div style={StakePoolStyles.stakeInfoLabel}>Immature Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{immatureTicketsCount}</div>
      </div>
      <div style={StakePoolStyles.stakeInfoRowRight}>
        <div style={StakePoolStyles.stakeInfoLabel}>Expired Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{expiredTicketsCount}</div>
      </div>
    </div>
    <div style={StakePoolStyles.stakeInfoRow}>
      <div style={StakePoolStyles.stakeInfoRowLeft}>
        <div style={StakePoolStyles.stakeInfoLabel}>Live Tickets:</div>
        <div style={StakePoolStyles.stakeInfoValue}>{liveTicketsCount}</div>
      </div>
    </div>
  </div>
) : (
  <div style={StakePoolStyles.stakeInfoAreaSmall}>
    <div style={StakePoolStyles.stakeInfoRowSmall}>
      <div style={StakePoolStyles.stakeInfoLabel}>Own Mempool Tickets:</div>
      <div style={StakePoolStyles.stakeInfoValue}>{ownMempoolTicketsCount}</div>
    </div>
    <div style={StakePoolStyles.stakeInfoRowSmall}>
      <div style={StakePoolStyles.stakeInfoLabel}>Immature Tickets:</div>
      <div style={StakePoolStyles.stakeInfoValue}>{immatureTicketsCount}</div>
    </div>
    <div style={StakePoolStyles.stakeInfoRowSmallRight}>
      <div style={StakePoolStyles.stakeInfoLabel}>Live Tickets:</div>
      <div style={StakePoolStyles.stakeInfoValue}>{liveTicketsCount}</div>
      <TicketsCogs
        opened={!isShowingDetails}
        style={{paddingTop: "2px"}}
        onClick={onShowStakeInfo}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
