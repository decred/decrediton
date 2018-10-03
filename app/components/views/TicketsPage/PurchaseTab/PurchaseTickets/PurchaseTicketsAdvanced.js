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
  <Aux>
    <div className="stakepool-purchase-ticket-row">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.stakePoolLabel" m="Stake Pool" />:
      </div>
      <div className="stakepool-purchase-ticket-input-select">
        <StakePoolSelect
          options={configuredStakePools}
          value={stakePool}
          onChange={onChangeStakePool}
        />
      </div>
      <div className="stakepool-manage-pool-button-area">
        <a className="manage-pools-button" onClick={onShowStakePoolConfig} />
      </div>
    </div>
    <div className="stakepool-purchase-ticket-row">
      <div className="stakepool-purchase-ticket-row-thirds-first">
        <div className="stakepool-purchase-ticket-label">
          <T id="purchaseTickets.ticketFee" m="Ticket Fee" />
            :</div>
        <div className="stakepool-purchase-ticket-thirds-input">
          <div className="stakepool-input-form-purchase-ticket">
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
        </div>
      </div>
      <div className="stakepool-purchase-ticket-row-thirds">
        <div className="stakepool-purchase-ticket-label-second">
          <T id="purchaseTickets.txFee" m="Tx Fee" />:</div>
        <div className="stakepool-purchase-ticket-thirds-input">
          <div className="stakepool-input-form-purchase-ticket">
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
        </div>
      </div>
      <div className="stakepool-purchase-ticket-row-thirds">
        <div className="stakepool-purchase-ticket-label-second">
          <T id="purchaseTickets.advanced.expiry" m="Expiry" />:</div>
        <div className="stakepool-purchase-ticket-thirds-input">
          <div className="stakepool-input-form-purchase-ticket">
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
      </div>
    </div>
    <div className="stakepool-purchase-ticket-row">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.advanced.ticketAddress" m="Ticket Address" /> :</div>
      <div className="stakepool-purchase-ticket-address-input">
        <div className="stakepool-input-form-purchase-ticket">
          <AddressInput
            disabled readOnly
            className="stakepool-content-nest-purchase-ticket-form-disabled"
            value={stakePool ? stakePool.value.TicketAddress : null}
          />
        </div>
      </div>
    </div>
    <div className="stakepool-purchase-ticket-row">
      <div className="stakepool-purchase-ticket-label">
        <T id="purchaseTickets.advanced.poolAddress" m="Pool Address" />
          :</div>
      <div className="stakepool-purchase-ticket-address-input">
        <div className="stakepool-input-form-purchase-ticket">
          <AddressInput
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
          <PercentInput
            disabled readOnly
            className="stakepool-content-nest-purchase-ticket-form-disabled"
            value={stakePool ? stakePool.value.PoolFees : null}
          />
        </div>
      </div>
    </div>
  </Aux>);

export default PurchaseTicketsAdvanced;
