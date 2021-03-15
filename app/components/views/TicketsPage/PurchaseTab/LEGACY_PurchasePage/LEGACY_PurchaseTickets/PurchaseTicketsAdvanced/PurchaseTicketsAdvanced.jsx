import {
  FeeInput,
  PercentInput,
  BlocksInput,
  AddressInput,
  LEGACY_StakePoolSelect
} from "inputs";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./PurchaseTicketsAdvanced.module.css";

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
  label,
  className,
  onIconClick,
  id,
  children
}) => (
  <>
    <label htmlFor={id} className={classNames(styles.infoLabel, className)}>
      {label}:
    </label>
    <div className={classNames(styles.infoValue, className)}>
      {children}
      <div
        className={classNames(styles.icon, className)}
        onClick={onIconClick}
      />
    </div>
  </>
);

const PurchaseTicketsAdvanced = ({
  configuredStakePools,
  stakePool,
  ticketFee,
  txFee,
  expiry,
  ticketFeeError,
  txFeeError,
  expiryError,
  toggleShowVsp,
  onChangeStakePool,
  onChangeTicketFee,
  onChangeTxFee,
  onChangeExpiry,
  formatMessage,
  ...props
}) => (
  <div className={styles.infoGrid}>
    <PurchaseTicketAdvancedInfo
      label={<T id="purchaseTickets.stakePoolLabel" m="VSP" />}
      className={styles.stakePools}
      onIconClick={() => toggleShowVsp(true)}>
      <LEGACY_StakePoolSelect
        options={configuredStakePools}
        value={stakePool}
        onChange={onChangeStakePool}
        className={classNames(styles.input, styles.bigInput)}
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      id="advanced-ticket-fee"
      label={<T id="purchaseTickets.ticketFee" m="Ticket Fee" />}
      className={styles.ticketFee}>
      <FeeInput
        {...{ ...props }}
        name={"ticketFee"}
        required
        invalid={ticketFeeError}
        invalidMessage={
          <T
            id="purchaseTickets.errors.invalidTicketFee"
            m="Invalid ticket fee"
          />
        }
        placeholder={formatMessage(messages.ticketFeePlaceholder)}
        value={ticketFee}
        onChange={onChangeTicketFee}
        showErrors={true}
        className={classNames(styles.input, styles.smallInput)}
        id="advanced-ticket-fee"
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      id="advanced-tx-fee"
      label={<T id="purchaseTickets.txFee" m="Tx Fee" />}
      className={styles.txFee}>
      <FeeInput
        required
        invalid={txFeeError}
        invalidMessage={
          <T id="purchaseTickets.errors.invalidTxFee" m="Invalid tx fee" />
        }
        placeholder={formatMessage(messages.txFeePlaceholder)}
        value={txFee}
        onChange={onChangeTxFee}
        showErrors={true}
        className={classNames(styles.input, styles.smallInput)}
        id="advanced-tx-fee"
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      id="advanced-expiry"
      label={<T id="purchaseTickets.advanced.expiry" m="Expiry" />}
      className={styles.expiry}>
      <BlocksInput
        required
        invalid={expiryError}
        invalidMessage={
          <T id="purchaseTickets.errors.expiryRequred" m="Invalid expiry" />
        }
        placeholder={formatMessage(messages.expiryPlaceholder)}
        value={expiry}
        onChange={onChangeExpiry}
        showErrors={true}
        className={classNames(styles.input, styles.smallInput)}
        id="advanced-expiry"
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      id="advanced-ticket-address"
      label={
        <T id="purchaseTickets.advanced.ticketAddress" m="Ticket Address" />
      }
      className={styles.ticketAddress}>
      <AddressInput
        disabled
        readOnly
        className={classNames(styles.input, styles.bigInput)}
        value={stakePool ? stakePool.value.TicketAddress : null}
        id="advanced-ticket-address"
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      id="advanced-vsp-address"
      label={<T id="purchaseTickets.advanced.poolAddress" m="VSP Address" />}
      className={styles.poolAddress}>
      <AddressInput
        disabled
        readOnly
        className={classNames(styles.input, styles.bigInput)}
        value={stakePool ? stakePool.value.PoolAddress : null}
        id="advanced-vsp-address"
      />
    </PurchaseTicketAdvancedInfo>
    <PurchaseTicketAdvancedInfo
      id="advanced-vsp-fees"
      label={<T id="purchaseTickets.advanced.poolFees" m="VSP Fees" />}
      className={styles.poolFees}>
      <PercentInput
        disabled
        readOnly
        className={classNames(styles.input, styles.smallInput)}
        value={stakePool ? stakePool.value.PoolFees : null}
        id="advanced-vsp-fees"
      />
    </PurchaseTicketAdvancedInfo>
  </div>
);

export default PurchaseTicketsAdvanced;
