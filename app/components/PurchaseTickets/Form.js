import React from "react";
import { Link } from "react-router";
import Select from "react-select";
import NumTicketsInput from "../NumTicketsInput";
import ManagePoolsButton from "../ManagePoolsButton";
import SelectStakePool from "../SelectStakePool";
import KeyBlueButton from "../KeyBlueButton";
import PurchaseTicketsInfoButton from "../PurchaseTicketsInfoButton";
import TicketsCogs from "../TicketsCogs";
import { StakePoolStyles } from "../views/ViewStyles";
import { addSpacingAroundText } from "../../helpers/strings";

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  spendingAccounts,
  account,
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
    <div style={StakePoolStyles.votingTitleArea}>
      <div style={StakePoolStyles.votingTitleAreaName}>Purchase Tickets</div>
      <div style={StakePoolStyles.purchaseTicketInputButtons}>
        <PurchaseTicketsInfoButton onClick={onShowTicketsInfo}/>
        <TicketsCogs opened={!isShowingAdvanced} onClick={onToggleShowAdvanced}/>
      </div>
    </div>
    <div style={isShowingAdvanced ? StakePoolStyles.flexHeightShown : StakePoolStyles.flexHeightHidden }>
      <div style={StakePoolStyles.purchaseTicketRow}>
        <div style={StakePoolStyles.purchaseTicketRowAccountSelect}>
          <div style={StakePoolStyles.purchaseTicketAccountSelectLabel}>Account:</div>
          <div style={StakePoolStyles.purchaseTicketInputSelect}>
            <Select
              value={account}
              onChange={onChangeAccount}
              clearable={false}
              style={{zIndex:"9"}}
              placeholder={"Select account..."}
              multi={false}
              valueKey="value"
              labelKey="label"
              options={spendingAccounts}
            />
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
        <div style={StakePoolStyles.purchaseTicketRowNumTickets}>
          <div style={StakePoolStyles.purchaseTicketLabel}>Number of Tickets:</div>
          <div style={StakePoolStyles.purchaseTicketNumSelect}>
            <NumTicketsInput
              numTickets={numTicketsToBuy}
              incrementNumTickets={onIncrementNumTickets}
              decrementNumTickets={onDecrementNumTickets}
            />
          </div>
        </div>
      </div>
      <div hidden={isShowingAdvanced ? false : true}>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketLabel}>
            Stake Pool:
          </div>
          <div style={StakePoolStyles.purchaseTicketInputSelect}>
            <SelectStakePool
              options={configuredStakePools}
              value={stakePool}
              onChange={onChangeStakePool}
            />
          </div>
          <div style={StakePoolStyles.managePoolButtonArea}>
            <ManagePoolsButton onClick={onShowStakePoolConfig} />
          </div>
        </div>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketRowThirds}>
            <div style={StakePoolStyles.purchaseTicketLabel}>Ticket Fee (DCR/kB):</div>
            <div style={StakePoolStyles.purchaseTicketThirdsInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Ticket Fee"
                  value={ticketFee}
                  onChange={e => onChangeTicketFee(e.target.value)}
                />
              </div>
            </div>
            {ticketFeeError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{ticketFeeError}</div>
            ) : null}
          </div>
          <div style={StakePoolStyles.purchaseTicketRowThirds}>
            <div style={StakePoolStyles.purchaseTicketLabel}>Tx Fee (DCR/kB):</div>
            <div style={StakePoolStyles.purchaseTicketThirdsInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Tx Fee"
                  value={txFee}
                  onChange={e => onChangeTxFee(e.target.value)}
                />
              </div>
            </div>
            {txFeeError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{txFeeError}</div>
            ) : null}
          </div>
          <div style={StakePoolStyles.purchaseTicketRowThirds}>
            <div style={StakePoolStyles.purchaseTicketLabel}>Expiry:</div>
            <div style={StakePoolStyles.purchaseTicketThirdsInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Expiry"
                  value={expiry}
                  onChange={e => onChangeExpiry(e.target.value)}
                />
              </div>
            </div>
            {expiryError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{expiryError}</div>
            ) : null}
          </div>
        </div>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketLabel}>Ticket Address:</div>
          <div style={StakePoolStyles.purchaseTicketAddressInput}>
            <div style={StakePoolStyles.inputFormPurchaseTicket}>
              <input
                type="text"
                disabled readOnly
                style={StakePoolStyles.contentNestPurchaseTicketFormDisabled}
                value={stakePool ? stakePool.value.TicketAddress : null}
              />
            </div>
          </div>
        </div>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketLabel}>Pool Address:</div>
          <div style={StakePoolStyles.purchaseTicketAddressInput}>
            <div style={StakePoolStyles.inputFormPurchaseTicket}>
              <input
                type="text"
                disabled readOnly
                style={StakePoolStyles.contentNestPurchaseTicketFormDisabled}
                value={stakePool ? stakePool.value.PoolAddress : null}
              />
            </div>
          </div>
        </div>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketRowLeft}>
            <div style={StakePoolStyles.purchaseTicketLabel}>Pool Fees:</div>
            <div style={StakePoolStyles.purchaseTicketNumInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  disabled readOnly
                  style={StakePoolStyles.contentNestPurchaseTicketFormDisabled}
                  value={stakePool ? stakePool.value.PoolFees : null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div hidden={isShowingAdvanced ? true : false} style={StakePoolStyles.purchaseTicketQuickBarRow}>
        <div style={StakePoolStyles.quickBarRowLabel}>Settings:</div>
        <div style={StakePoolStyles.stakepoolIcon} data-tip="Current Stakepool">{stakePool ? stakePool.value.Host : null}</div>
        <div style={StakePoolStyles.feeIcon} data-tip="Ticket Fee">{ticketFee} DCR/KB</div>
        <div style={StakePoolStyles.feeIcon} data-tip="Tx Fee">{txFee} DCR/KB</div>
        <div style={StakePoolStyles.expiryIcon} data-tip="Expiry">{expiry} Blocks</div>
        <div style={StakePoolStyles.ticketAddressIcon} data-tip="Ticket Address">{stakePool ? addSpacingAroundText(stakePool.value.TicketAddress) : null}</div>
        <div style={StakePoolStyles.feeAddressIcon} data-tip="Pool Address">{stakePool ? addSpacingAroundText(stakePool.value.PoolAddress) : null}</div>
        <div style={StakePoolStyles.poolFeeIcon} data-tip="Pool Fee">{stakePool ? stakePool.value.PoolFees : null}%</div>
      </div>
    </div>
    <div style={StakePoolStyles.purchaseTicketButtonsArea}>
      <KeyBlueButton
        style={StakePoolStyles.contentPurchaseButton}
        disabled={!canAffordTickets}
        onClick={onRequestPassphrase}
      >Purchase</KeyBlueButton>

      {canAffordTickets ? null : (
        <span style={{color: "red", float: "left", paddingLeft: "20px", paddingTop: "19px"}}>
          Insufficient spendable account balance to purchase tickets.
        </span>
      )}

      <KeyBlueButton
        style={StakePoolStyles.contentImportScriptButton}
        onClick={onShowImportScript}
      >Import Script</KeyBlueButton>
      <KeyBlueButton
        style={StakePoolStyles.contentRevokeButton}
        onClick={onShowRevokeTicket}
      >Revoke</KeyBlueButton>
    </div>
  </div>
);

export default PurchaseTicketsForm;
