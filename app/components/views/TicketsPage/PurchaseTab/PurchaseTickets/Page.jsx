import UnsignedTickets from "../UnsignedTickets";
import StakeInfo from "../StakeInfo/StakeInfo";
import PurchaseForm from "./PurchaseForm";
import { ShowWarning, Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "../PurchaseTab.module.css";
import TicketAutoBuyer from "../TicketAutoBuyer/TicketAutoBuyer";

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
    <div className={styles.checkbox}>
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
  vspOptions,
  account,
  numTickets,
  onChangeNumTickets,
  setNumTickets,
  handleOnKeyDown,
  ticketPrice,
  setVSP,
  isValid,
  toggleIsLegacy,
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
            setNumTickets,
            handleOnKeyDown,
            vspOptions,
            account,
            numTickets,
            onChangeNumTickets,
            setVSP,
            isValid
          }}
        />
      )}
      {isWatchingOnly && <UnsignedTickets {...{ ...props }} />}
      <TicketAutoBuyer />

    </div>
  );
}
