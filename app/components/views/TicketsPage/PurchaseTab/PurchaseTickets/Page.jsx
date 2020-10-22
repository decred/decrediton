import UnsignedTickets from "../UnsignedTickets";
import StakeInfo from "../StakeInfo/StakeInfo";
import PrivacyInfo from "../PrivacyInfo/PrivacyInfo";
import PurchaseForm from "./PurchaseForm";
import { ShowWarning, Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "../PurchaseTab.module.css";
import { classNames } from "pi-ui";
import TicketAutoBuyer from "../TicketAutoBuyer/TicketAutoBuyer";

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
    <div className={classNames(styles.iconWrapper, styles.checkbox)}>
      <div className={styles.label}>
        <T id="purchase.isLegacy" m="Is Legacy" />
      </div>
      <input
        id="box"
        type="checkbox"
        checked={false}
        onChange={() => toggleIsLegacy(true)}
      />
      <label htmlFor="box" className={styles.checkboxLabel}></label>
    </div>
    <InfoDocModalButton
      document="PurchaseTicketsInfo"
      modalClassName={styles.infoFields}
      className={"info-title-icon"}
      draggable
    />
  </>
);

export function PurchasePage({
  spvMode,
  blocksNumberToNextTicket,
  sidebarOnBottom,
  isWatchingOnly,
  availableVSPs,
  account,
  setAccount,
  numTickets,
  onChangeNumTickets,
  setNumTickets,
  handleOnKeyDown,
  ticketPrice,
  setVSP,
  isValid,
  toggleIsLegacy,
  onV3PurchaseTicket,
  mixedAccount,
  changeAccount,
  ...props
}) {
  return (
    <div className="purchase-ticket-area">
      <Subtitle
        title={<T id="purchase.subtitle" m="Purchase Tickets" />}
        children={getTitleIcon({ toggleIsLegacy })}
        className="is-row"
      />
      <StakeInfo {...{ sidebarOnBottom }} />
      { mixedAccount && changeAccount && <PrivacyInfo /> }
      {spvMode && blocksNumberToNextTicket === 2 ? (
        <ShowWarning
          warn={
            <T
              id="spv.purchase.warn"
              m="Purchase Tickets is not available right now, because we are at the end of a ticket interval. After one block it will be available again."
            />
          }
        />
      ) : (
        <PurchaseForm
          {...{
            ticketPrice,
            setAccount,
            setNumTickets,
            handleOnKeyDown,
            availableVSPs,
            account,
            numTickets,
            onChangeNumTickets,
            setVSP,
            isValid,
            onV3PurchaseTicket
          }}
        />
      )}
      {isWatchingOnly && <UnsignedTickets {...{ ...props }} />}
      <TicketAutoBuyer />

    </div>
  );
}
