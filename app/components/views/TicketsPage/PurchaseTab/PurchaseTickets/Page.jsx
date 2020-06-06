import UnsignedTickets from "../UnsignedTickets";
import StakeInfo from "../StakeInfo";
import PurchaseTickets from "./form";
import { ShowWarning, Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "../PurchaseTab.module.css";

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
    <div className={styles.legacyIcon} onClick={() => toggleIsLegacy(true)}>
      change to legacy
    </div>
    <InfoDocModalButton
      document="PurchaseTicketsInfo"
      modalClassName="info-modal-fields"
      className="info-title-icon"
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
  toggleIsLegacy
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
          <PurchaseTickets {...{
            ticketPrice,
            setNumTickets,
            handleOnKeyDown,
            vspOptions,
            account,
            numTickets,
            onChangeNumTickets,
            setVSP,
            isValid
          }} />
        )}
      {isWatchingOnly && <UnsignedTickets {...{ ...props }} />}
    </div>
  )
}