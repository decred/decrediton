import React from "react";
import { Link } from "react-router";
import AccountsSelect from "../AccountsSelect";
import NumTicketsInput from "../NumTicketsInput";
import ManagePoolsButton from "../ManagePoolsButton";
import SelectStakePool from "../SelectStakePool";
import KeyBlueButton from "../KeyBlueButton";
import PurchaseTicketsInfoButton from "../PurchaseTicketsInfoButton";
import TicketsCogs from "../TicketsCogs";
import "../../style/StakePool.less";
import { addSpacingAroundText } from "../../helpers/strings";

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  configuredStakePools,
  stakePool,
  hasTicketsToRevoke,
  numTicketsToBuy,
  canAffordTickets,
  ticketFee,
  txFee,
  expiry,
  ticketFeeError,
  txFeeError,
  expiryError,
  rescanRequest,
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
      <div className="stakepool-voting-title-area-name">Purchase Tickets</div>
      <div className="stakepool-purchase-ticket-input-buttons">
        <PurchaseTicketsInfoButton onClick={onShowTicketsInfo}/>
        <TicketsCogs opened={!isShowingAdvanced} onClick={onToggleShowAdvanced}/>
      </div>
    </div>
    <div className={isShowingAdvanced ? "stakepool-flex-height-shown" : "stakepool-flex-height-hidden" }>
      <div className="stakepool-purchase-ticket-row">
        <div className="stakepool-purchase-ticket-row-account-select">
          <div className="stakepool-purchase-ticket-account-select-label">Account:</div>
          <div className="stakepool-purchase-ticket-input-select">
            <AccountsSelect onChange={onChangeAccount} />
          </div>
          <Link
            className="accounts-button-icon"
            data-place="bottom"
            data-type="info"
            data-effect="solid"
            data-tip={"Accounts"}
            to={"/accounts"}
          />
        </div>
        <div className="stakepool-purchase-ticket-row-num-tickets">
          <div className="stakepool-purchase-ticket-label">Number of Tickets:</div>
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
            Stake Pool:
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
            <div className="stakepool-purchase-ticket-label">Ticket Fee (DCR/kB):</div>
            <div className="stakepool-purchase-ticket-thirds-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Ticket Fee"
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
            <div className="stakepool-purchase-ticket-label">Tx Fee (DCR/kB):</div>
            <div className="stakepool-purchase-ticket-thirds-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Tx Fee"
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
            <div className="stakepool-purchase-ticket-label">Expiry:</div>
            <div className="stakepool-purchase-ticket-thirds-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Expiry"
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
          <div className="stakepool-purchase-ticket-label">Ticket Address:</div>
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
          <div className="stakepool-purchase-ticket-label">Pool Address:</div>
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
          <div className="stakepool-purchase-ticket-label">Pool Fees:</div>
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
        <div className="stakepool-quick-bar-row-label">Settings:</div>
        <div className="stakepool-icon" data-tip="Current Stakepool">{stakePool ? stakePool.value.Host : null}</div>
        <div className="stakepool-fee-icon" data-tip="Ticket Fee">{ticketFee} DCR/KB</div>
        <div className="stakepool-fee-icon" data-tip="Tx Fee">{txFee} DCR/KB</div>
        <div className="stakepool-expiry-icon" data-tip="Expiry">{expiry} Blocks</div>
        <div className="stakepool-ticket-address-icon" data-tip="Ticket Address">{stakePool ? addSpacingAroundText(stakePool.value.TicketAddress) : null}</div>
        <div className="stakepool-fee-address-icon" data-tip="Pool Address">{stakePool ? addSpacingAroundText(stakePool.value.PoolAddress) : null}</div>
        <div className="stakepool-pool-fee-icon" data-tip="Pool Fee">{stakePool ? stakePool.value.PoolFees : null}%</div>
      </div>
    </div>
    <div className="stakepool-purchase-ticket-buttons-area">
      <KeyBlueButton
        className="stakepool-content-purchase-button"
        disabled={!canAffordTickets}
        onClick={onRequestPassphrase}
      >Purchase</KeyBlueButton>

      {canAffordTickets ? null : (
        <div className="stakepool-purchase-error">
          Insufficient spendable account balance to purchase tickets.
        </div>
      )}

      <div className="stakepool-content-import-script-button"
        data-html={true}
        data-tip-disable={!rescanRequest}
        data-type="warning"
        data-place="top"
        data-tip="Importing scripts is disabled during a rescan.">
        <KeyBlueButton
          className=""
          disabled={rescanRequest}
          onClick={onShowImportScript}
        >Import Script</KeyBlueButton>
      </div>
      {hasTicketsToRevoke ? <KeyBlueButton
        className="stakepool-content-revoke-button"
        onClick={onShowRevokeTicket}
      >Revoke</KeyBlueButton> : null}
    </div>
  </div>
);

export default PurchaseTicketsForm;
