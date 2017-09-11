import React from "react";
import "../../style/StakePool.less";
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
  <div className="stakepool-stake-info-area">
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label">Poolsize:</div>
        <div className="stakepool-stake-info-value">{ticketPoolSize}</div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label">Voted Tickets:</div>
        <div className="stakepool-stake-info-value">{votedTicketsCount}</div>
        <TicketsCogs
          opened={!isShowingDetails}
          style={{paddingTop: "2px"}}
          onClick={onHideStakeInfo}
        />
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label">All Mempool Tickets:</div>
        <div className="stakepool-stake-info-value">{allMempoolTicketsCount}</div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label">Missed Tickets:</div>
        <div className="stakepool-stake-info-value">{missedTicketsCount}</div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label">Own Mempool Tickets:</div>
        <div className="stakepool-stake-info-value">{ownMempoolTicketsCount}</div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label">Revoked Tickets:</div>
        <div className="stakepool-stake-info-value">{revokedTicketsCount}</div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label">Immature Tickets:</div>
        <div className="stakepool-stake-info-value">{immatureTicketsCount}</div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label">Expired Tickets:</div>
        <div className="stakepool-stake-info-value">{expiredTicketsCount}</div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label">Live Tickets:</div>
        <div className="stakepool-stake-info-value">{liveTicketsCount}</div>
      </div>
    </div>
  </div>
) : (
  <div className="stakepool-stake-info-area-small">
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label">Own Mempool Tickets:</div>
      <div className="stakepool-stake-info-value">{ownMempoolTicketsCount}</div>
    </div>
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label">Immature Tickets:</div>
      <div className="stakepool-stake-info-value">{immatureTicketsCount}</div>
    </div>
    <div className="stakepool-stake-info-row-small-right">
      <div className="stakepool-stake-info-label">Live Tickets:</div>
      <div className="stakepool-stake-info-value">{liveTicketsCount}</div>
      <TicketsCogs
        opened={!isShowingDetails}
        style={{paddingTop: "2px"}}
        onClick={onShowStakeInfo}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
