// @flow
import React from "react";
import SlateGrayButton from "../../../../SlateGrayButton";
import KeyBlueButton from "../../../../KeyBlueButton";
import Balance from "../../../../Balance";
import ReactToolTip from "react-tooltip";
import "../../../../../style/Fonts.less";
import "../../../../../style/AccountRow.less";

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
  hideAccount
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
          <div className="account-row-top-spendable">Spendable <Balance amount={account.spendable}/></div>
        </div>
      </div>
    </div>
    {!isShowingAccountDetails ? <div></div> :
      isShowingRenameAccount
        ? (
          <div className="account-row-details-bottom" key={"details"+account.accountNumber}>
            <div className="account-row-details-bottom-title">
              <div className="account-row-details-bottom-title-name">Rename Account</div>
            </div>
            <div className="account-row-details-bottom-rename">
              <div className="account-row-details-bottom-rename-name">New Account Name:</div>
              <div className="account-row-details-bottom-spec-value">
                <div className="account-input-form">
                  <input
                    key={"rename"+account.accountNumber}
                    type="text"
                    className="address-content-nest-address-hash-to"
                    placeholder="New Account Name"
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
                Rename
              </KeyBlueButton>
              <SlateGrayButton
                className="content-confirm-new-account"
                onClick={hideRenameAccount}>
                Cancel
              </SlateGrayButton>
            </div>
          </div>
        )
       : (
         <div className="account-row-details-bottom" key={"details"+account.accountNumber}>
           <div className="account-row-details-bottom-columns">
            <div className="account-row-details-bottom-column-left">
              <div className="account-row-details-bottom-title">
                <div className="account-row-details-bottom-title-name">Balances</div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Total</div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.total}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Spendable</div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.spendable}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Immature Rewards</div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.immatureReward}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Locked By Tickets</div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.lockedByTickets}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Voting Authority</div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.votingAuthority}/></div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Immature Stake Generation</div>
                <div className="account-row-details-bottom-spec-value"><Balance amount={account.immatureStakeGeneration}/></div>
              </div>
            </div>
            <div className="account-row-details-bottom-column-right">
              <div className="account-row-details-bottom-title">
                <div className="account-row-details-bottom-title-name">Properties</div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Account number</div>
                <div className="account-row-details-bottom-spec-value">{account.accountNumber}</div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">HD Path</div>
                <div className="account-row-details-bottom-spec-value">{account.HDPath}</div>
              </div>
              <div className="account-row-details-bottom-spec">
                <div className="account-row-details-bottom-spec-name">Keys</div>
                <div className="account-row-details-bottom-spec-value">{account.externalKeys} external, {account.internalKeys} internal, {account.importedKeys} imported</div>
              </div>
            </div>
          </div>
          <div className="account-actions">
            {account.accountName !== "imported" ?
              <div
                key={"renameAccountButton"+account.accountNumber}
                className="rename-account-button"
                onClick={showRenameAccount}
                data-tip="Rename Account"/>:
              <div></div>
            }
            {account.accountName !== "imported" && account.accountName !== "default" && account.total == 0 && !hidden ?
              <div
                key={"hideAccountButton"+account.accountNumber}
                className="hide-account-button"
                onClick={hideAccount}
                data-tip="Hide"/>:
              account.accountName !== "imported" && account.accountName !== "default" && hidden ?
              <div
                className="show-account-button"
                key={"showAccountButton"+account.accountNumber}
                onClick={showAccount}
                data-tip="Show"/> :
              <div></div>
            }
          </div>
          <ReactToolTip type="info" effect="solid"/>
         </div>
       )
    }
  </div>
);

export default Row;
