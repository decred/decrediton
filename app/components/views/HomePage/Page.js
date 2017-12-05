// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import KeyBlueButton from "KeyBlueButton";
import PassphraseModalButton from "PassphraseModalButton";
import { PassphraseModalContent } from "modals";
import Balance from "Balance";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  routes,
  spendableTotalBalance,
  rescanAttempt,
  hasTicketsToRevoke,
  rescanRequest,
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
              modalTitle={<h1><T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" /></h1>}
              modalContent={<PassphraseModalContent onSubmit={onRevokeTickets}/>}
              className="stakepool-content-revoke-button"
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
