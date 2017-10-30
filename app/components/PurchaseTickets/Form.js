import AccountsSelect from "../AccountsSelect";
import NumTicketsInput from "../NumTicketsInput";
import ManagePoolsButton from "../ManagePoolsButton";
import SelectStakePool from "../SelectStakePool";
import KeyBlueButton from "../KeyBlueButton";
import { Icon, Flex, Heading } from "shared";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import { LinkToAccounts, Tooltip } from "shared";
import { addSpacingAroundText } from "helpers/strings";
import "style/StakePool.less";

const messages = defineMessages({
  txFeePlaceholder: {
    id: "purchaseTickets.txFeePlaceholder",
    defaultMessage: "Tx Fee",
  },
  ticketFeePlaceholder: {
    id: "purchaseTickets.ticketFeePlaceholder",
    defaultMessage: "Ticket Fee",
  },
  expiryPlaceholder: {
    id: "purchaseTickets.expiryPlaceholder",
    defaultMessage: "Expiry",
  },
});

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
  onShowTicketsInfo,
  intl: { formatMessage },
  account
}) => {

  const v = e => e.target.value;
  const changeTicketFee = e => onChangeTicketFee(v(e));
  const changeTxFee = e => onChangeTxFee(v(e));
  const changeExpiry = e => onChangeExpiry(v(e));

  return (
  <Aux>
    <Flex my="1em" align="center">
      <Heading f={ 20 }><T id="purchaseTickets.title" m="Purchase Titckets" /></Heading>
      <Icon i="info" ml="auto" onClick={onShowTicketsInfo} tooltip={<T id="accounts.balanceInfo" m="Ticket Purchase Information"/>} />
      <Icon i="cog" mx="1em" active={isShowingAdvanced} onClick={onToggleShowAdvanced}/>
    </Flex>
    <div className={isShowingAdvanced ? "stakepool-flex-height-shown" : "stakepool-flex-height-hidden" }>
      <div className="stakepool-purchase-ticket-row">
        <div className="stakepool-purchase-ticket-row-account-select">
          <div className="stakepool-purchase-ticket-account-select-label"><T id="purchaseTickets.account" m="Account" />:</div>
          <div className="stakepool-purchase-ticket-input-select">
            <AccountsSelect
                {...{account}} onChange={onChangeAccount}/>
          </div>
          <LinkToAccounts />
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
                  onChange={ changeTicketFee }
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
                  onChange={ changeTxFee }
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
                  onChange={ changeExpiry }
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
      <Flex show={ !isShowingAdvanced } className="stakepool-purchase-ticket-quick-bar-row">
        <div className="stakepool-quick-bar-row-label"><T id="purchaseTickets.settings" m="Settings" />:</div>
        <Flex wrap>
          <Tooltip text={ <T id="purchaseTickets.currentStakepool" m="Current StakePool" /> }>
            <div className="stakepool-icon">{ stakePool && stakePool.value.Host }</div>
          </Tooltip>
          <Tooltip text={ <T id="purchaseTickets.ticketFeeTip" m="Ticket Fee" /> }>
            <div className="stakepool-fee-icon">{ ticketFee } DCR/KB</div>
          </Tooltip>
          <Tooltip text={ <T id="purchaseTickets.txFeeTip" m="Tx Fee" /> }>
            <div className="stakepool-fee-icon">{txFee} DCR/KB</div>
          </Tooltip>
          <Tooltip text={ <T id="purchaseTickets.expiry" m="Expiry" /> }>
            <div className="stakepool-expiry-icon">{expiry} Blocks</div>
          </Tooltip>
          <Tooltip text={ <T id="purchaseTickets.ticketAddress" m="Ticket Address" /> }>
            <div className="stakepool-ticket-address-icon">{ stakePool && addSpacingAroundText(stakePool.value.TicketAddress) }</div>
          </Tooltip>
          <Tooltip text={ <T id="purchaseTickets.poolAddress" m="Pool Address" /> }>
            <div className="stakepool-fee-address-icon">{ stakePool && addSpacingAroundText(stakePool.value.PoolAddress) }</div>
          </Tooltip>
          <Tooltip text={ <T id="purchaseTickets.poolFee" m="Pool Fee" /> }>
            <div className="stakepool-pool-fee-icon">{ stakePool && stakePool.value.PoolFees }%</div>
          </Tooltip>
        </Flex>
      </Flex>
    </div>
    <div className="stakepool-purchase-ticket-buttons-area">
      <KeyBlueButton onClick={onRequestPassphrase} className="stakepool-content-purchase-button" disabled={!canAffordTickets}>
        <T id="puchaseTickets.purchaseBtn" m="Purchase" />
      </KeyBlueButton>

      { !canAffordTickets &&
        <div className="stakepool-purchase-error">
          <T id="purchaseTickets.errors.insufficientBalance" m="Insufficient spendable account balance to purchase tickets." />
        </div> }

      <Tooltip className="stakepool-content-import-script-button" tipWarning tipDisabled={ !rescanRequest }
        text={ <T id="purchaseTickets.importDisabledRescan" m="Importing scripts is disabled during a rescan."/> }>
          <KeyBlueButton disabled={rescanRequest} onClick={onShowImportScript}>
            <T id="purchaseTickets.importScriptBtn" m="Import Script" />
          </KeyBlueButton>
      </Tooltip>

      { hasTicketsToRevoke &&
        <KeyBlueButton className="stakepool-content-revoke-button" onClick={onShowRevokeTicket}>
          <T id="purchaseTickets.revokeBtn" m="Revoke" />
        </KeyBlueButton> }
    </div>
  </Aux>);
};

export default injectIntl(PurchaseTicketsForm);
