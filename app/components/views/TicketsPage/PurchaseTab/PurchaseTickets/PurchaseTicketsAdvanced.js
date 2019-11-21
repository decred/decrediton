import { FeeInput, PercentInput, BlocksInput, AddressInput, StakePoolSelect } from "inputs";
import { FormattedMessage as T, defineMessages } from "react-intl";
import cx from "classnames";

const messages = defineMessages({
  txFeePlaceholder: {
    id: "purchaseTickets.txFeePlaceholder",
    defaultMessage: "Tx Fee"
  },
  ticketFeePlaceholder: {
    id: "purchaseTickets.ticketFeePlaceholder",
    defaultMessage: "Ticket Fee"
  },
  expiryPlaceholder: {
    id: "purchaseTickets.expiryPlaceholder",
    defaultMessage: "Expiry"
  }
});

const PurchaseTicketAdvancedInfo = ({
  label, className, onIconClick, children
}) => (<>
  <div className={cx("purchase-ticket-advanced-info-label", className)}>{label}:</div>
  <div className={cx("purchase-ticket-advanced-info-value", className)}>
    {children}
    <div className={cx("stakepool-info-icon", className)} onClick={onIconClick} />
  </div>
</>);


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
  ...props
}) => (
  <div className="purchase-ticket-advanced-info-grid">
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.stakePoolLabel" m="VSP" />}
      className="stake-pools"
      onIconClick={onShowStakePoolConfig}>
      <StakePoolSelect
        options={configuredStakePools}
        value={stakePool}
        onChange={onChangeStakePool}
        className="stakepool-purchase-ticket-input stakepool-advanced-big-input"
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.ticketFee" m="Ticket Fee" />}
      className="ticket-fee">
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
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.txFee" m="Tx Fee" />}
      className="tx-fee">
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
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.advanced.expiry" m="Expiry" />}
      className="expiry">
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
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.advanced.ticketAddress" m="Ticket Address" />}
      className="ticket-address">
      <AddressInput
        disabled readOnly
        className="stakepool-purchase-ticket-input stakepool-advanced-big-input"
        value={stakePool ? stakePool.value.TicketAddress : null}
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.advanced.poolAddress" m="Pool Address" />}
      className="pool-address">
      <AddressInput
        disabled readOnly
        className="stakepool-purchase-ticket-input stakepool-advanced-big-input"
        value={stakePool ? stakePool.value.PoolAddress : null}
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.poolFees" m="Pool Fees" />}
      className="pool-fees">
      <PercentInput
        disabled readOnly
        className="stakepool-purchase-ticket-input advanced-small-input"
        value={stakePool ? stakePool.value.PoolFees : null}
      />
    </PurchaseTicketAdvancedInfo>
  </div>);

export default PurchaseTicketsAdvanced;
