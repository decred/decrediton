import { Balance } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import { Column } from "./helpers";
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
      <Column
        label={<T id="stake.mempoolTickets" m="All Mempool Tickets" />}
        value={<FormattedNumber value={allMempoolTicketsCount}/> }
      />
      <Column
        label={<T id="stake.votedTickets" m="Voted Tickets" />}
        value={<FormattedNumber value={votedTicketsCount} />}
      />
      <Column
        label={<T id="stake.missedTickets" m="Missed Tickets" />}
        value={<FormattedNumber value={missedTicketsCount}/>}
      />
    </div>
    <div className="stakepool-stake-info-row">
      <Column
        label={<T id="stake.poolSize" m="Pool Size" />}
        value={<FormattedNumber value={ticketPoolSize} />}
      />
      <Column
        label={<T id="stake.expiredTickets" m="Expired Tickets" />}
        value={<FormattedNumber value={expiredTicketsCount}/>}
      />
      <Column
        label={<T id="stake.revokedTickets" m="Revoked Tickets" />}
        value={<FormattedNumber value={revokedTicketsCount} />}
      />
    </div>
    <div className="stakepool-stake-info-row">
      <Column
        label={<T id="stake.totalRewards" m="Total Rewards" />}
        value={<Balance amount={totalSubsidy}/>}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
