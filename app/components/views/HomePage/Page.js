// @flow
import { rescan, home } from "connectors";
import DecredLoading from "../../DecredLoading";
import KeyBlueButton from "../../KeyBlueButton";
import PassphraseModal from "../../PassphraseModal";
import Balance from "../../Balance";
import TxHistory from "../../TxHistory";
import { FormattedMessage as T } from "react-intl";
import { Tooltip, TabbedHeader } from "shared";
import "style/Fonts.less";
import "style/HomePage.less";

const rescanBtnMessage =
`Rescanning may help resolve some balance errors.

Note: This scans the entire blockchain for transactions,
but does not re-download it.`;

const HomePage = ({
  routes,
  spendableTotalBalance,
  rescanAttempt,
  isRequestingPassphrase,
  passphraseCallback,
  hasTicketsToRevoke,
  passphraseHeading,
  passphraseDescription,
  onCancelPassphraseRequest,
  onShowRevokeTicket,
  rescanRequest,
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
      <TabbedHeader noDesc noIcon {...{ routes }}>
        <Balance amount={spendableTotalBalance} />
        <Tooltip text={ <T id="home.rescanBtn.tip" m={ rescanBtnMessage} /> } disabled={ rescanRequest }>
          <KeyBlueButton disabled={rescanRequest} onClick={() => rescanAttempt(0)}>
            <T id="home.rescanBtn" m="Rescan" />
          </KeyBlueButton>
        </Tooltip>
      </TabbedHeader>
      {getTransactionsRequestAttempt ? (
        <div className="page-content"><DecredLoading /></div>
      ) : (
          <div className="page-content">
            {hasTicketsToRevoke ? <div className="tickets-to-revoke-warning">
              <T id="home.revokeTicketMessage"
                m="You have outstanding missed or expired tickets, please revoke them to unlock your funds" />
              <KeyBlueButton
                className="stakepool-content-revoke-button"
                onClick={onShowRevokeTicket}
              >
                <T id="purchaseTickets.revokeBtn" m="Revoke" />
              </KeyBlueButton>
            </div> : null}
            <div className="home-content-title">
              <div className="home-content-title-text">
                <T id="home.recentTransactionsTitle" m="Recent Transactions" />
              </div>
            </div>
            <div className="home-content-nest">
              {(transactions.length > 0) ? (
                <TxHistory {...{ getAccountsResponse, transactions }} />
              ) : (
                  <p><T id="home.noTransactions" m="No transactions" /></p>
                )}
            </div>
          </div>
        )}
    </Aux>
  );
};

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
