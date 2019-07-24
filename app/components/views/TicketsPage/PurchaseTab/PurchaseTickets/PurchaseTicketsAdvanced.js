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
  <div className="is-row purchase-ticket-advanced-info-area">
    <div className="purchase-ticket-advanced-labels">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.stakePoolLabel" m="Stake Pool" />:
      </div>
      <div className="stakepool-purchase-ticket-label inputs-row-label">
        <T id="purchaseTickets.ticketFee" m="Ticket Fee" />:
      </div>
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.advanced.ticketAddress" m="Ticket Address" />:
      </div>
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.advanced.poolAddress" m="Pool Address" />:
      </div>
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.poolFees" m="Pool Fees" />:
      </div>
    </div>
    <div className="purchase-ticket-advanced-inputs" >
      <div className="is-row">
        <StakePoolSelect
          options={configuredStakePools}
          value={stakePool}
          onChange={onChangeStakePool}
          className="stakepool-purchase-ticket-input stakepool-advanced-big-input"
        />
        <div className="manage-pools-button" onClick={onShowStakePoolConfig} />
      </div>
      <div className="is-row inputs-row">
        <FeeInput {...{ ...props }}
          name={"ticketFee"}
          required
          invalid={ticketFeeError}
          invalidMessage={<T id="purchaseTickets.errors.invalidTicketFee" m="Invalid ticket fee" />}
          placeholder={formatMessage(messages.ticketFeePlaceholder)}
          value={ticketFee}
          onChange={onChangeTicketFee}
          showErrors={true}
          className="stakepool-purchase-ticket-input advanced-small-input"
        />
        <div className="is-row">
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
            className="stakepool-purchase-ticket-input advanced-small-input"
          />
        </div>
        <div className="is-row">
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
            className="stakepool-purchase-ticket-input advanced-small-input"
          />
        </div>
      </div>
      <AddressInput
        disabled readOnly
        className="stakepool-purchase-ticket-input stakepool-advanced-big-input"
        value={stakePool ? stakePool.value.TicketAddress : null}
      />
      <AddressInput
        disabled readOnly
        className="stakepool-purchase-ticket-input stakepool-advanced-big-input"
        value={stakePool ? stakePool.value.PoolAddress : null}
      />
      <PercentInput
        disabled readOnly
        className="stakepool-purchase-ticket-input advanced-small-input"
        value={stakePool ? stakePool.value.PoolFees : null}
      />
    </div>
  </div>);

export default PurchaseTicketsAdvanced;
