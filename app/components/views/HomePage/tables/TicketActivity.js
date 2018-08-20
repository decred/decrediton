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
  goToMyTickets,
  tsDate,
}) => {
  const hasTickets = tickets.length > 0;
  return (
    getTransactionsRequestAttempt ? <DecredLoading /> :
      <Aux>
        <div className="home-content-title">
          {hasTickets
            ? <T id="home.ticketActivityTitle" m="Staking Activity" />
            : <T id="home.noTickets.title" m="No tickets yet" /> }
          {hasTickets &&
          <div className="home-content-link">
            <a onClick={goToMyTickets}><T id="home.ticketActivityHistory" m="See all" /> &#8594;</a>
          </div>
          }
        </div>
        <div className="home-content-nest">
          {hasTickets
            ? <TxHistory overview limit={rowNumber} {...{ getAccountsResponse, transactions: tickets, tsDate }} />
            : <NoTicketsLinks />}
        </div>
      </Aux>
  );
};

export default home(RecentTickets);
