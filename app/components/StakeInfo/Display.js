import React from "react";
import "../../style/StakePool.less";
import TicketsCogs from "../TicketsCogs";
import Balance from "../Balance";
import { FormattedNumber, FormattedMessage } from "react-intl";

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
  totalSubsidy,
  liveTicketsCount,
  onHideStakeInfo,
  onShowStakeInfo
}) => isShowingDetails ? (
  <div className="stakepool-stake-info-area">
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.poolSize" defaultMessage="Pool Size" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={ticketPoolSize} /></div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.votedTickets" defaultMessage="Voted Tickets" />:</div>
        <div className="stakepool-stake-info-value">{votedTicketsCount}</div>
      </div>
      <div className="stakepool-stake-info-show-advanced-area">
        <TicketsCogs
          opened={!isShowingDetails}
          style={{paddingTop: "2px"}}
          onClick={onHideStakeInfo}
        />
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.mempoolTickets" defaultMessage="All Mempool Tickets" />:</div>
        <div className="stakepool-stake-info-value">{allMempoolTicketsCount}</div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.missedTickets" defaultMessage="Missed Tickets" />:</div>
        <div className="stakepool-stake-info-value">{missedTicketsCount}</div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.ownMempoolTickets" defaultMessage="Own Mempool Tickets" />:</div>
        <div className="stakepool-stake-info-value">
          <FormattedMessage id="stakepool.ownMempoolTicketsCount"
            defaultMessage="{ownMempoolTicketsCount, plural, one {# ticket} other {# tickets}}" values={{ownMempoolTicketsCount}}/></div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.revokedTickets" defaultMessage="Revoked Tickets" />:</div>
        <div className="stakepool-stake-info-value">
          <FormattedMessage id="stakepool.revokedTicketsCount"
            description="Number of revoked tickets"
            defaultMessage="{revokedTicketsCount, plural, one {# ticket} other {# tickets}}" values={{revokedTicketsCount}}/>
        </div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.immatureTickets" defaultMessage="Immature Tickets" />:</div>
        <div className="stakepool-stake-info-value">{immatureTicketsCount}</div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.expiredTickets" defaultMessage="Expired Tickets" />:</div>
        <div className="stakepool-stake-info-value">{expiredTicketsCount}</div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.liveTickets" defaultMessage="Live Tickets" />:</div>
        <div className="stakepool-stake-info-value">
          <FormattedMessage id="stakepool.liveTicketsCount"
            description="number of live tickets"
            defaultMessage="{liveTicketsCount, plural, one {# ticket} other {# tickets}}" values={{liveTicketsCount}}/></div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><FormattedMessage id="stake.totalSubsidy" defaultMessage="Total Subsidy" />:</div>
        <div className="stakepool-stake-info-value"><Balance amount={totalSubsidy}/></div>
      </div>
    </div>
  </div>
) : (
  <div className="stakepool-stake-info-area-small">
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label"><FormattedMessage id="stake.ownMempoolTickets" defaultMessage="Own Mempool Tickets" />:</div>
      <div className="stakepool-stake-info-value">{ownMempoolTicketsCount}</div>
    </div>
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label"><FormattedMessage id="stake.immatureTickets" defaultMessage="Immature Tickets" />:</div>
      <div className="stakepool-stake-info-value">{immatureTicketsCount}</div>
    </div>
    <div className="stakepool-stake-info-row-small-right">
      <div className="stakepool-stake-info-label"><FormattedMessage id="stake.liveTickets" defaultMessage="Live Tickets" />:</div>
      <div className="stakepool-stake-info-value">{liveTicketsCount}</div>
    </div>
    <div className="stakepool-stake-info-show-advanced-area">
      <TicketsCogs
        opened={!isShowingDetails}
        style={{paddingTop: "2px"}}
        onClick={onShowStakeInfo}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
