// @flow
import { home } from "connectors";
import { DecredLoading } from "indicators";
import { TxHistory } from "shared";
import { FormattedMessage as T } from "react-intl";
import NoTicketsLinks from "./NoTicketsLinks";
import "style/HomePage.less";

const RecentTickets = ({
  tickets,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber,
  goToMyTickets,
  tsDate
}) =>
  getTransactionsRequestAttempt ? (
    <DecredLoading />
  ) : (
    <div className="ticket-tx-wrapper">
      <div className="home-content-title is-row">
        {tickets.length > 0 ? (
          <T id="home.ticketActivityTitle" m="Staking Activity" />
        ) : (
          <T id="home.noTickets.title" m="No tickets yet" />
        )}
        {tickets.length > 0 && (
          <div className="home-content-link">
            <a onClick={goToMyTickets}>
              <T id="home.ticketActivityHistory" m="See all" /> &#8594;
            </a>
          </div>
        )}
      </div>
      {tickets.length > 0 ? (
        <TxHistory
          overview
          limit={rowNumber}
          {...{ getAccountsResponse, transactions: tickets, tsDate }}
        />
      ) : (
        <NoTicketsLinks />
      )}
    </div>
  );

export default home(RecentTickets);
