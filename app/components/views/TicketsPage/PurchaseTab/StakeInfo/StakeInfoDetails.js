import { Balance } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import { Column } from "./Display";
import "style/StakePool.less";

const StakeInfoDisplay = ({
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  totalSubsidy,
  isSPV
}) => (
  <div className="stake-info-details">
    <div className="is-row stake-info-details-row">
      <Column
        className={"stake-info"}
        label={<T id="stakeSPV.votedTickets" m="Voted Tickets" />}
        value={<FormattedNumber value={votedTicketsCount} />}
      />
      <Column
        className={"stake-info"}
        label={<T id="stakeSPV.expiredTickets" m="Expired Tickets" />}
        value={<FormattedNumber value={expiredTicketsCount}/>}
      />
      <Column
        className={"stake-info"}
        label={<T id="stakeSPV.revokedTickets" m="Revoked Tickets" />}
        value={<FormattedNumber value={revokedTicketsCount} />}
      />
    </div>
    {
      !isSPV && (
        <div className="is-row stake-info-details-row">
          <Column
            className={"stake-info"}
            label={<T id="stake.mempoolTickets" m="All Mempool Tickets" />}
            value={<FormattedNumber value={allMempoolTicketsCount}/> }
          />
          <Column
            className={"stake-info"}
            label={<T id="stake.poolSize" m="Pool Size" />}
            value={<FormattedNumber value={ticketPoolSize} />}
          />
          <Column
            className={"stake-info"}
            label={<T id="stake.missedTickets" m="Missed Tickets" />}
            value={<FormattedNumber value={missedTicketsCount}/>}
          />
        </div>
      )}
    <div className="is-row stake-info-details-row">
      <Column
        className={"stake-info"}
        label={<T id="stake.totalRewards" m="Total Rewards" />}
        value={<Balance amount={totalSubsidy}/>}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
