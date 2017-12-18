import { Balance } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const StakeInfoDisplay = ({
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  totalSubsidy,
}) => (
  <div className="stakepool-stake-info-area">
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><T id="stake.poolSize" m="Pool Size" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={ticketPoolSize} /></div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><T id="stake.votedTickets" m="Voted Tickets" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={votedTicketsCount} /></div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><T id="stake.mempoolTickets" m="All Mempool Tickets" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={allMempoolTicketsCount}/> </div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><T id="stake.missedTickets" m="Missed Tickets" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={missedTicketsCount}/></div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><T id="stake.expiredTickets" m="Expired Tickets" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={expiredTicketsCount}/></div>
      </div>
      <div className="stakepool-stake-info-row-right">
        <div className="stakepool-stake-info-label"><T id="stake.revokedTickets" m="Revoked Tickets" />:</div>
        <div className="stakepool-stake-info-value"><FormattedNumber value={revokedTicketsCount} /></div>
      </div>
    </div>
    <div className="stakepool-stake-info-row">
      <div className="stakepool-stake-info-row-left">
        <div className="stakepool-stake-info-label"><T id="stake.totalSubsidy" m="Total Subsidy" />:</div>
        <div className="stakepool-stake-info-value"><Balance amount={totalSubsidy}/></div>
      </div>
    </div>
  </div>
);

export default StakeInfoDisplay;
