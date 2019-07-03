import { Balance } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import { Column } from "./helpers";
import "style/StakePool.less";

const StakeInfoDisplay = ({
  votedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  totalSubsidy,
}) => (
  <div className="stakepool-stake-info-area">
    <div className="stakepool-stake-info-row">
      <Column
        label={<T id="stakeSPV.votedTickets" m="Voted Tickets" />}
        value={<FormattedNumber value={votedTicketsCount} />}
      />
      <Column
        label={<T id="stakeSPV.expiredTickets" m="Expired Tickets" />}
        value={<FormattedNumber value={expiredTicketsCount}/>}
      />
      <Column
        label={<T id="stakeSPV.revokedTickets" m="Revoked Tickets" />}
        value={<FormattedNumber value={revokedTicketsCount} />}
      />
    </div>

    <div className="stakepool-stake-info-row">
      <Column
        label={<T id="stakeSPV.totalRewards" m="Total Rewards" />}
        value={<Balance amount={totalSubsidy}/>}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
