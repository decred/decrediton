import PurchaseTickets from "../LEGACY_PurchaseTickets";
import TicketAutoBuyer from "../LEGACY_TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "../../StakeInfo/StakeInfo";
import { ShowWarning, Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import UnsignedTickets from "../../UnsignedTickets";
import styles from "./Tickets.module.css";
import { Checkbox } from "pi-ui";

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
    <div className={styles.iconWrapper}>
      <InfoDocModalButton
        document="PurchaseTicketsInfo"
        modalClassName={styles.infoFields}
        className={styles.infoTitleIcon}
        draggable
      />
      <Checkbox
        label={<T id="purchase.isLegacy.legacy" m="Use Legacy VSP" />}
        className={styles.useLegacyLabel}
        id="box"
        checked={true}
        onChange={() => toggleIsLegacy(false)}
      />
    </div>
  </>
);

const Tickets = ({
  spvMode,
  blocksNumberToNextTicket,
  sidebarOnBottom,
  isWatchingOnly,
  toggleIsLegacy,
  notMixedAccounts,
  getRunningIndicator,
  ...props
}) => {
  return (
    <div className={styles.purchaseTicketArea}>
      <StakeInfo {...{ sidebarOnBottom }} />
      <Subtitle
        title={<T id="purchase.subtitle.legacy" m="Purchase Tickets" />}
        children={getTitleIcon({ toggleIsLegacy })}
        className={styles.isRow}
      />
      {spvMode && blocksNumberToNextTicket === 2 ? (
        <ShowWarning
          warn={
            <T
              id="spv.purchase.warn.legacy"
              m="Purchase Tickets is not available right now, because we are at the end of a ticket interval. After one block it will be available again."
            />
          }
        />
      ) : (
        <PurchaseTickets
          {...{ ...props, notMixedAccounts, getRunningIndicator }}
        />
      )}
      {isWatchingOnly ? (
        <UnsignedTickets {...{ ...props }} />
      ) : spvMode ? (
        <div>
          <T
            id="spv.auto.buyer.warn"
            m="Ticket Auto Buyer not available while using SPV"
          />
        </div>
      ) : (
        <TicketAutoBuyer />
      )}
    </div>
  );
};

export default Tickets;
