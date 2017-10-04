import React from "react";
import { Link } from "react-router";
import AccountsSelect from "../AccountsSelect";
import NumTicketsInput from "../NumTicketsInput";
import ManagePoolsButton from "../ManagePoolsButton";
import SelectStakePool from "../SelectStakePool";
import KeyBlueButton from "../KeyBlueButton";
import PurchaseTicketsInfoButton from "../PurchaseTicketsInfoButton";
import TicketsCogs from "../TicketsCogs";
import { FormattedMessage as T, defineMessages } from "react-intl";
import "../../style/StakePool.less";
import { addSpacingAroundText } from "../../helpers/strings";

const messages = defineMessages({
  accounts: {
    id: "purchaseTickets.accountsTip",
    defaultMessage: "Accounts"
  },
  currentStakepool: {
    id: "purchaseTickets.currentStakepool",
    defaultMessage: "Current StakePool",
  },
  currentFee: {
    id: "purchaseTickets.currentFee",
    defaultMessage: "Current Fee",
  },
  txFeeTip: {
    id: "purchaseTickets.txFeeTip",
    defaultMessage: "Tx Fee",
  },
  txFeePlaceholder: {
    id: "purchaseTickets.txFeePlaceholder",
    defaultMessage: "Tx Fee",
  },
  ticketFeeTip: {
    id: "purchaseTickets.ticketFeeTip",
    defaultMessage: "Ticket Fee",
  },
  ticketFeePlaceholder: {
    id: "purchaseTickets.ticketFeePlaceholder",
    defaultMessage: "Ticket Fee",
  },
  expiry: {
    id: "purchaseTickets.expiry",
    defaultMessage: "Expiry",
  },
  expiryPlaceholder: {
    id: "purchaseTickets.expiryPlaceholder",
    defaultMessage: "Expiry",
  },
  ticketAddress: {
    id: "purchaseTickets.ticketAddress",
    defaultMessage: "Ticket Address",
  },
  poolAddress: {
    id: "purchaseTickets.poolAddress",
    defaultMessage: "Pool Address",
  },
  poolFee: {
    id: "purchaseTickets.poolFee",
    defaultMessage: "Pool Fee",
  },
  importDisabledRescan: {
    id: "purchaseTickets.importDisabledRescan",
    defaultMessage: "Importing scripts is disabled during a rescan."
  }
});

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  configuredStakePools,
  stakePool,
  numTicketsToBuy,
  canAffordTickets,
  ticketFee,
  txFee,
  expiry,
  ticketFeeError,
  txFeeError,
  expiryError,
  rescanRequest,
  formatMessage,
  onIncrementNumTickets,
  onDecrementNumTickets,
  onShowStakePoolConfig,
  onChangeAccount,
  onChangeStakePool,
  onChangeTicketFee,
  onChangeTxFee,
  onChangeExpiry,
  onRequestPassphrase,
  onShowImportScript,
  onShowRevokeTicket,
  onToggleShowAdvanced,
  onShowTicketsInfo
}) => (
  <div>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">
        <T id="purchaseTickets.title" m="Purchase Titckets" /></div>
      <div className="stakepool-purchase-ticket-input-buttons">
        <PurchaseTicketsInfoButton onClick={onShowTicketsInfo}/>
        <TicketsCogs opened={!isShowingAdvanced} onClick={onToggleShowAdvanced}/>
      </div>
    </div>
    <div className={isShowingAdvanced ? "stakepool-flex-height-shown" : "stakepool-flex-height-hidden" }>
      <div className="stakepool-purchase-ticket-row">
        <div className="stakepool-purchase-ticket-row-account-select">
          <div className="stakepool-purchase-ticket-account-select-label"><T id="purchaseTickets.account" m="Account" />:</div>
          <div className="stakepool-purchase-ticket-input-select">
            <AccountsSelect onChange={onChangeAccount} />
          </div>
          <Link
            className="accounts-button-icon"
            data-place="bottom"
            data-type="info"
            data-effect="solid"
            data-tip={formatMessage(messages.accounts)}
            to={"/accounts"}
          />
        </div>
        <div className="stakepool-purchase-ticket-row-num-tickets">
          <div className="stakepool-purchase-ticket-label">
            <T id="purchaseTickets.number" m="Number of Tickets" />:</div>
          <div className="stakepool-purchase-ticket-num-select">
            <NumTicketsInput
              numTickets={numTicketsToBuy}
              incrementNumTickets={onIncrementNumTickets}
              decrementNumTickets={onDecrementNumTickets}
            />
          </div>
        </div>
      </div>
      <div hidden={isShowingAdvanced ? false : true}>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-label">
            <T id="purchaseTickets.stakePoolLabel" m="Stake Pool" />:
          </div>
          <div className="stakepool-purchase-ticket-input-select">
            <SelectStakePool
              options={configuredStakePools}
              value={stakePool}
              onChange={onChangeStakePool}
            />
          </div>
          <div className="stakepool-manage-pool-button-area">
            <ManagePoolsButton onClick={onShowStakePoolConfig} />
          </div>
        </div>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-thirds">
            <div className="stakepool-purchase-ticket-label">
              <T id="purchaseTickets.ticketFee" m="Ticket Fee (DCR/kB)" />
              :</div>
            <div className="stakepool-purchase-ticket-thirds-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.ticketFeePlaceholder)}
                  value={ticketFee}
                  onChange={e => onChangeTicketFee(e.target.value)}
                />
              </div>
            </div>
            {ticketFeeError ? (
              <div className="stakepool-purchase-ticket-input-error">{ticketFeeError}</div>
            ) : null}
          </div>
          <div className="stakepool-purchase-ticket-row-thirds">
            <div className="stakepool-purchase-ticket-label">
              <T id="purchaseTickets.txFee" m="Tx Fee (DCR/kB)" />:</div>
            <div className="stakepool-purchase-ticket-thirds-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.txFeePlaceholder)}
                  value={txFee}
                  onChange={e => onChangeTxFee(e.target.value)}
                />
              </div>
            </div>
            {txFeeError ? (
              <div className="stakepool-purchase-ticket-input-error">{txFeeError}</div>
            ) : null}
          </div>
          <div className="stakepool-purchase-ticket-row-thirds">
            <div className="stakepool-purchase-ticket-label">
              <T id="purchaseTickets.expiry" m="Expiry" />:</div>
            <div className="stakepool-purchase-ticket-thirds-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.expiryPlaceholder)}
                  value={expiry}
                  onChange={e => onChangeExpiry(e.target.value)}
                />
              </div>
            </div>
            {expiryError ? (
              <div className="stakepool-purchase-ticket-input-error">{expiryError}</div>
            ) : null}
          </div>
        </div>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-label">
            <T id="purchaseTickets.ticketAddress" m="Ticket Address" /> :</div>
          <div className="stakepool-purchase-ticket-address-input">
            <div className="stakepool-input-form-purchase-ticket">
              <input
                type="text"
                disabled readOnly
                className="stakepool-content-nest-purchase-ticket-form-disabled"
                value={stakePool ? stakePool.value.TicketAddress : null}
              />
            </div>
          </div>
        </div>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-label">
            <T id="purchaseTickets.poolAddress" m="Pool Address" />
            :</div>
          <div className="stakepool-purchase-ticket-address-input">
            <div className="stakepool-input-form-purchase-ticket">
              <input
                type="text"
                disabled readOnly
                className="stakepool-content-nest-purchase-ticket-form-disabled"
                value={stakePool ? stakePool.value.PoolAddress : null}
              />
            </div>
          </div>
        </div>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-label">
            <T id="purchaseTickets.poolFees" m="Pool Fees" />:</div>
          <div className="stakepool-purchase-ticket-num-input">
            <div className="stakepool-input-form-purchase-ticket">
              <input
                type="text"
                disabled readOnly
                className="stakepool-content-nest-purchase-ticket-form-disabled"
                value={stakePool ? stakePool.value.PoolFees : null}
              />
            </div>
          </div>
        </div>
      </div>
      <div hidden={isShowingAdvanced ? true : false} className="stakepool-purchase-ticket-quick-bar-row">
        <div className="stakepool-quick-bar-row-label"><T id="purchaseTickets.settings" m="Settings" />:</div>
        <div className="stakepool-icon" data-tip={formatMessage(messages.currentStakepool)}>{stakePool ? stakePool.value.Host : null}</div>
        <div className="stakepool-fee-icon" data-tip={formatMessage(messages.ticketFeeTip)}>{ticketFee} DCR/KB</div>
        <div className="stakepool-fee-icon" data-tip={formatMessage(messages.txFeeTip)}>{txFee} DCR/KB</div>
        <div className="stakepool-expiry-icon" data-tip={formatMessage(messages.expiry)}>{expiry} Blocks</div>
        <div className="stakepool-ticket-address-icon" data-tip={formatMessage(messages.ticketAddress)}>{stakePool ? addSpacingAroundText(stakePool.value.TicketAddress) : null}</div>
        <div className="stakepool-fee-address-icon" data-tip={formatMessage(messages.poolAddress)}>{stakePool ? addSpacingAroundText(stakePool.value.PoolAddress) : null}</div>
        <div className="stakepool-pool-fee-icon" data-tip={formatMessage(messages.poolFee)}>{stakePool ? stakePool.value.PoolFees : null}%</div>
      </div>
    </div>
    <div className="stakepool-purchase-ticket-buttons-area">
      <KeyBlueButton
        className="stakepool-content-purchase-button"
        disabled={!canAffordTickets}
        onClick={onRequestPassphrase}
      >
        <T id="puchaseTickets.purchaseBtn" m="Purchase" />
      </KeyBlueButton>

      {canAffordTickets ? null : (
        <div className="stakepool-purchase-error">
          <T id="purchaseTickets.errors.insufficientBalance" m="Insufficient spendable account balance to purchase tickets." />
        </div>
      )}

      <div className="stakepool-content-import-script-button"
        data-html={true}
        data-tip-disable={!rescanRequest}
        data-type="warning"
        data-place="top"
        data-tip={formatMessage(messages.importDisabledRescan)}>
        <KeyBlueButton
          className=""
          disabled={rescanRequest}
          onClick={onShowImportScript}
        >
          <T id="purchaseTickets.importScriptBtn" m="Import Script" />
        </KeyBlueButton>
      </div>
      <KeyBlueButton
        className="stakepool-content-revoke-button"
        onClick={onShowRevokeTicket}
      >
        <T id="purchaseTickets.revokeBtn" m="Revoke" />
      </KeyBlueButton>
    </div>
  </div>
);

export default PurchaseTicketsForm;
