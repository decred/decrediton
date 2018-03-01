// @flow
import { home } from "connectors";
import { DecredLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const RecentTickets = ({
  tickets,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber,
}) => {
  return (
    getTransactionsRequestAttempt ? <DecredLoading /> :
      <Aux>
        <div className="home-content-title">
          <T id="home.ticketActivityTitle" m="Recent Staking Activity" />
        </div>
        <div className="home-content-nest">
          <TxHistory overview limit={rowNumber} {...{ getAccountsResponse, transactions: tickets }} />
        </div>
      </Aux>
  );
};

export default home(RecentTickets);
