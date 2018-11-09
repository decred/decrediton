import { Balance } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import { Row, LastRow, Column } from "./helpers";
import "style/StakePool.less";

const StakeInfoDisplay = ({
  votedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  totalSubsidy,
}) => (
  <div className="stakepool-stake-info-area">
    <Row>
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
    </Row>
    <LastRow>
      <Column
        label={<T id="stakeSPV.totalRewards" m="Total Rewards" />}
        value={<Balance amount={totalSubsidy}/>}
      />
    </LastRow>
  </div>
);

export default StakeInfoDisplay;
