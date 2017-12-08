// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import PassphraseModalButton from "PassphraseModalButton";
import Balance from "Balance";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  routes,
  spendableTotalBalance,
  hasTicketsToRevoke,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  onRevokeTickets
}) => {
  return (
    <Aux>
      <TabbedHeader {...{ routes }}>
        <div className="overview-balance">
          <Balance amount={spendableTotalBalance} large/>
        </div>
      </TabbedHeader>
      { getTransactionsRequestAttempt ? <div className="page-content"><DecredLoading /></div> :
      <div className="page-content">
        { hasTicketsToRevoke &&
        <div className="tickets-to-revoke-warning">
          <T id="home.revokeTicketMessage" m="You have outstanding missed or expired tickets, please revoke them to unlock your funds" />
          <PassphraseModalButton
              modalTitle={<T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />}
              className="stakepool-content-revoke-button"
              onSubmit={onRevokeTickets}
          >
            <T id="puchaseTickets.revokeBtn" m="Revoke" />
          </PassphraseModalButton>
        </div> }
        <div className="home-content-title">
          <div className="home-content-title-text">
            <T id="home.recentTransactionsTitle" m="Recent Transactions" />
          </div>
        </div>
        <div className="home-content-nest">
          { transactions.length > 0 ?
          <TxHistory {...{ getAccountsResponse, transactions }} /> :
          <p><T id="home.noTransactions" m="No transactions" /></p> }
        </div>
      </div> }
    </Aux>
  );
};

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
