// @flow
import { home } from "connectors";
import { DecredLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import NoTicketsLinks from "./NoTicketsLinks";
import "style/Fonts.less";
import "style/HomePage.less";

const RecentTickets = ({
  tickets,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber,
  goToMyTickets
}) => {
  const hasTickets = tickets.length > 0;
  return (
    getTransactionsRequestAttempt ? <DecredLoading /> :
      <Aux>
        <div className="home-content-title">
          {hasTickets
            ? <T id="home.ticketActivityTitle" m="Recent Staking Activity" />
            : <T id="home.noTickets.title" m="No tickets yet" /> }
        </div>
        <div className="home-content-nest">
          {hasTickets
            ? <TxHistory overview limit={rowNumber} {...{ getAccountsResponse, transactions: tickets }} />
            : <NoTicketsLinks />}
        </div>
        <div className="home-content-link">
          <a onClick={goToMyTickets}><T id="home.ticketActivityHistory" m="Go to all tickets" /> ></a>
        </div>
      </Aux>
  );
};

export default home(RecentTickets);
