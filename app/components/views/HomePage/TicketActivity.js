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
}) => {
  return (
    getTransactionsRequestAttempt ? <DecredLoading /> :
      <Aux>
        <div className="home-content-title">
          <T id="home.ticketActivityTitle" m="Recent Tickets" />
        </div>
        <div className="home-content-nest">
          {tickets.length > 0 ?
            <TxHistory limit={5} {...{ getAccountsResponse, transactions: tickets }} /> :
            <p><T id="home.noTickets" m="No tickets" /></p>}
        </div>
      </Aux>
  );
};

export default home(RecentTickets);
