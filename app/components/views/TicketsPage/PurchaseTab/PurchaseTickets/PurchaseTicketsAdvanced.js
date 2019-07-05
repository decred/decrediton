import { FeeInput, PercentInput, BlocksInput, AddressInput, StakePoolSelect } from "inputs";
import { FormattedMessage as T, defineMessages } from "react-intl";

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

const PurchaseTicketsAdvanced = ({
  configuredStakePools,
  stakePool,
  ticketFee,
  txFee,
  expiry,
  ticketFeeError,
  txFeeError,
  expiryError,
  onShowStakePoolConfig,
  onChangeStakePool,
  onChangeTicketFee,
  onChangeTxFee,
  onChangeExpiry,
  formatMessage,
  ...props,
}) => (
  <div className="purchase-ticket-advanced-info-area">
    <div className="is-row">
      <T id="purchaseTickets.stakePoolLabel" m="Stake Pool" />:
      <StakePoolSelect
        options={configuredStakePools}
        value={stakePool}
        onChange={onChangeStakePool}
        className="stakepool-purchase-ticket-input-select" 
      />
      <div className="manage-pools-button" onClick={onShowStakePoolConfig} />
    </div>
    <div className="is-row">
      <div className="is-row purchase-advanced-input">
        <div className="stakepool-purchase-ticket-label">
          <T id="purchaseTickets.ticketFee" m="Ticket Fee" />:
        </div>
        <FeeInput {...{ ...props }}
          name={"ticketFee"}
          required
          invalid={ticketFeeError}
          invalidMessage={<T id="purchaseTickets.errors.invalidTicketFee" m="Invalid ticket fee" />}
          placeholder={formatMessage(messages.ticketFeePlaceholder)}
          value={ticketFee}
          onChange={onChangeTicketFee}
          showErrors={true}
        />
      </div>
      <div className="is-row purchase-advanced-input">
        <div className="stakepool-purchase-ticket-label">
          <T id="purchaseTickets.txFee" m="Tx Fee" />:
        </div>
        <FeeInput
          required
          invalid={txFeeError}
          invalidMessage={<T id="purchaseTickets.errors.invalidTxFee" m="Invalid tx fee" />}
          placeholder={formatMessage(messages.txFeePlaceholder)}
          value={txFee}
          onChange={onChangeTxFee}
          showErrors={true}
        />
      </div>
      <div className="is-row purchase-advanced-input">
        <div className="stakepool-purchase-ticket-label">
          <T id="purchaseTickets.advanced.expiry" m="Expiry" />:
        </div>
          <BlocksInput
            required
            invalid={expiryError}
            invalidMessage={<T id="purchaseTickets.errors.expiryRequred" m="Invalid expiry" />}
            placeholder={formatMessage(messages.expiryPlaceholder)}
            value={expiry}
            onChange={onChangeExpiry}
            showErrors={true}
          />
      </div>
    </div>
    <div className="is-row">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.advanced.ticketAddress" m="Ticket Address" />:
      </div>
      <AddressInput
        disabled readOnly
        // className="stakepool-content-nest-purchase-ticket-form-disabled"
        value={stakePool ? stakePool.value.TicketAddress : null}
      />
    </div>
    <div className="is-row">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.advanced.poolAddress" m="Pool Address" />:
      </div>
      <AddressInput
        disabled readOnly
        // className="stakepool-content-nest-purchase-ticket-form-disabled"
        value={stakePool ? stakePool.value.PoolAddress : null}
      />
    </div>
    <div className="is-row">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.poolFees" m="Pool Fees" />:
      </div>
      <PercentInput
        disabled readOnly
        // className="stakepool-content-nest-purchase-ticket-form-disabled"
        value={stakePool ? stakePool.value.PoolFees : null}
      />
    </div>
  </div>);

export default PurchaseTicketsAdvanced;
