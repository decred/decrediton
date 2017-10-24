// @flow
import ReactToolTip from "react-tooltip";
import rescan from "../../../connectors/rescan";
import home from "../../../connectors/home";
import DecredLoading from "../../DecredLoading";
import KeyBlueButton from "../../KeyBlueButton";
import PassphraseModal from "../../PassphraseModal";
import Balance from "../../Balance";
import TxHistory from "../../TxHistory";
import Header from "../../Header";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "style/Layout.less";
import "style/Fonts.less";
import "style/HomePage.less";

const messages = defineMessages({
  rescanBtnTip: {
    id: "home.rescanBtn.tip",
    defaultMessage: `Rescanning may help resolve some balance errors.
      <br><br>Note: This scans the entire blockchain for transactions,
      but does not re-download it.`
  }
});

const HomePage = ({
  synced,
  spendableTotalBalance,
  rescanAttempt,
  isRequestingPassphrase,
  passphraseCallback,
  hasTicketsToRevoke,
  revokeTicketsSuccess,
  revokeTicketsError,
  passphraseHeading,
  passphraseDescription,
  onCancelPassphraseRequest,
  onShowRevokeTicket,
  rescanRequest,
  transactions,
  getTransactionsRequestAttempt,
  intl,
  getAccountsResponse,
  onClearRevokeTicketsError,
  onClearRevokeTicketsSuccess
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
      <Header
        headerTop={[synced ? null : (
          <div key="notSynced" className="home-view-notification-not-synced">
            <T id="home.notSyncedInfo" m="The wallet is not fully synced yet. Note: Balances will not be accurate until syncing is complete." />
          </div>
        ),
          revokeTicketsError ? (
          <div key="revokeTicketsError" className="stakepool-view-notification-error">
            <div className="stakepool-content-nest-address-delete-icon" onClick={onClearRevokeTicketsError} />
            {revokeTicketsError}
          </div>
        ) : null,
          revokeTicketsSuccess ? (
          <div key="revokeTicketsSuccess" className="stakepool-view-notification-success">
            <div className="stakepool-content-nest-address-delete-icon" onClick={onClearRevokeTicketsSuccess} />
            {revokeTicketsSuccess}
          </div>
        ) : null,
        ]}
        headerTitleOverview={<T id="home.availableBalanceTitle" m="Available Balance" />}
        headerMetaOverview={
          <div>
            <Balance amount={spendableTotalBalance} />
            <div className="home-rescan-button-area"
              data-multiline={true}
              data-tip={intl.formatMessage(messages.rescanBtnTip)}>
              <KeyBlueButton disabled={rescanRequest} onClick={() => rescanAttempt(0)}>
                <T id="home.rescanBtn" m="Rescan Blockchain" />
              </KeyBlueButton>
            </div>
            <ReactToolTip disable={rescanRequest ? true : false} place="left" type="info" effect="solid" />
          </div>
        }
      />
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

export default home(rescan(injectIntl(HomePage)));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
