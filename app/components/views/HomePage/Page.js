// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import SlateGrayButton from "SlateGrayButton";
import PassphraseModal from "PassphraseModal";
import Balance from "Balance";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  routes,
  spendableTotalBalance,
  isRequestingPassphrase,
  passphraseCallback,
  hasTicketsToRevoke,
  passphraseHeading,
  passphraseDescription,
  onCancelPassphraseRequest,
  onShowRevokeTicket,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse
}) => {
  return (
    <Aux>
      <PassphraseModal
        hidden={!isRequestingPassphrase}
        submitPassphrase={passphraseCallback}
        cancelPassphrase={onCancelPassphraseRequest}
        heading={passphraseHeading}
        description={passphraseDescription}
      />
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
          <SlateGrayButton className="stakepool-content-revoke-button" onClick={onShowRevokeTicket}>
            <T id="purchaseTickets.revokeBtn" m="Revoke" />
          </SlateGrayButton>
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
