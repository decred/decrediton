// @flow
import { Icon } from "shared";
import SlateGrayButton from "SlateGrayButton";
import KeyBlueButton from "KeyBlueButton";
import Balance from "Balance";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "style/Fonts.less";
import "style/AccountRow.less";

const messages = defineMessages({
  newNamePlaceholder: {
    id: "accounts.rename.newNamePlaceholder",
    defaultMessage: "New Account Name"
  }
});

const Row = ({
  account,
  hideAccountDetails,
  showAccountDetails,
  isShowingAccountDetails,
  isShowingRenameAccount,
  renameAccountNameError,
  hidden,
  updateRenameAccountName,
  renameAccount,
  showRenameAccount,
  hideRenameAccount,
  showAccount,
  hideAccount,
  intl
}) => (
  <div
    className={
      isShowingAccountDetails
        ? isShowingRenameAccount
          ? "account-row-rename"
          : "account-row-long"
        : "account-row-short"
    }
  >
    <div
      className={
        isShowingAccountDetails
          ? "account-row-details-top"
          : hidden
            ? "account-row-hidden"
            : "account-row"
      }
      key={"top"+account.accountNumber}
      onClick={
        isShowingAccountDetails
          ? hideAccountDetails
          : () => showAccountDetails(account.accountNumber)
      }
    >
      <div className="account-row-top-top">
        <div className="account-row-wallet-icon"/>
        <div className="account-row-top-account-name">{account.accountName}{
          hidden
            ? <span> (hidden)</span>
            : <span></span>
        }</div>
        <div className="account-row-top-account-funds">
          <Balance amount={account.total}/>
          <div className="account-row-top-last-tx"></div>
          <div className="account-row-top-spendable"><T id="accounts.spendable" m="Spendable" /> <Balance amount={account.spendable}/></div>
        </div>
      </div>
    </div>
    {!isShowingAccountDetails ? <div></div> :
      isShowingRenameAccount
        ? (
          <div className="account-row-details-bottom" key={"details"+account.accountNumber}>
            <div className="account-row-details-bottom-title">
              <div className="account-row-details-bottom-title-name">
                <T id="accounts.rename" m="Rename Account" />
              </div>
            </div>
            <div className="account-row-details-bottom-rename">
              <div className="account-row-details-bottom-rename-name">
                <T id="accounts.newName" m="New Account Name" />:
              </div>
              <div className="account-row-details-bottom-spec-value">
                <div className="account-input-form">
                  <input
                    key={"rename"+account.accountNumber}
                    type="text"
                    className="address-content-nest-address-hash-to"
                    placeholder={intl.formatMessage(messages.newNamePlaceholder)}
                    maxLength="50"
                    onBlur={(e) =>updateRenameAccountName(e.target.value)}
                  />
                </div>
              </div>
              <div className="account-form-input-error">
                {renameAccountNameError}
              </div>
            </div>
            <div className="account-form-buttons">
              <KeyBlueButton
                className="content-confirm-new-account"
                onClick={renameAccount}>
                <T id="accounts.renameBtn" m="Rename" />
              </KeyBlueButton>
              <SlateGrayButton
                className="content-confirm-new-account"
                onClick={hideRenameAccount}>
                <T id="accounts.cancelRenameBtn" m="Cancel" />
              </SlateGrayButton>
            </div>
          </div>
        )
       : (
         <div className="account-row-details-bottom" key={"details"+account.accountNumber}>
           <div className="account-row-details-bottom-columns">
            <div className="account-row-details-bottom-column-left">
              <div className="account-row-details-bottom-title">
                <div className="account-row-details-bottom-title-name">
                  <T id="accounts.balances" m="Balances" />
                </div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">
                  <T id="accounts.total" m="Total" />
                </div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.total}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">
                  <T id="accounts.spendable" m="Spendable" />
                </div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.spendable}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">
                  <T id="accounts.immatureRewards" m="Immature Rewards" />
                </div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.immatureReward}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">
                  <T id="accounts.lockedByTickets" m="Locked By Tickets" />
                </div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.lockedByTickets}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">
                  <T id="accounts.votingAuthority" m="Voting Authority" />
                </div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.votingAuthority}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">
                  <T id="accounts.immatureStake" m="Immature Stake Generation" />
                </div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.immatureStakeGeneration}/></div>
              </div>
            </div>
            <div className="account-row-details-bottom-column-right">
              <div className="account-row-details-bottom-title">
                <div className="account-row-details-bottom-title-name"><T id="accounts.properties" m="Properties" /></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name"><T id="accounts.number" m="Account number" /></div>
                <div className="account-row-details-bottom-spec-value">{account.accountNumber}</div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name"><T id="accounts.hdPath" m="HD Path" /></div>
                <div className="account-row-details-bottom-spec-value">{account.HDPath}</div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name"><T id="accounts.keys" m="Keys" /></div>
                <div className="account-row-details-bottom-spec-value">
                  <T id="accounts.keys.external" m="{keys} external" values={{keys: account.externalKeys}} />
                  <T id="accounts.keys.internal" m="{keys} internal" values={{keys: account.internalKeys}} />
                  <T id="accounts.keys.imported" m="{keys} imported" values={{keys: account.importedKeys}} />
                </div>
              </div>
            </div>
          </div>
          <div className="account-actions">
            { account.accountName !== "imported" &&
              <Icon i="accountRename" s={ 40 } onClick={ showRenameAccount } tooltip={ <T id="accounts.rename.tip" m="Rename Account" /> }/>
            }
            { account.accountName !== "imported" && account.accountName !== "default" && account.total == 0 && !hidden ?
              <Icon i="hideAccount" s={ 40 } onClick={ hideAccount } tooltip={ <T id="accounts.hide.tip" m="Hide" /> } /> :
              account.accountName !== "imported" && account.accountName !== "default" && hidden &&
              <Icon i="showAccount" s={ 40 } onClick={ showAccount } tooltip={ <T id="accounts.show.tip" m="Show" /> } />
            }
          </div>
         </div>
       )
    }
  </div>
);

export default injectIntl(Row);
