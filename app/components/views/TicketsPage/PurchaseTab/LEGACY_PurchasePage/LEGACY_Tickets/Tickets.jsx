import PurchaseTickets from "../LEGACY_PurchaseTickets";
import TicketAutoBuyer from "../LEGACY_TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "../../StakeInfo/StakeInfo";
import { ShowWarning, Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import UnsignedTickets from "../../UnsignedTickets";
import styles from "./Tickets.module.css";
import { classNames } from "pi-ui";

const getTitleIcon = () => (
  <>
    <div className={styles.iconWrapper}>
      <InfoDocModalButton
        document="PurchaseTicketsInfo"
        modalClassName={styles.infoFields}
        className={styles.infoTitleIcon}
        draggable
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
        children={getTitleIcon()}
        className={classNames(styles.isRow, styles.subtitle)}
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
          {...{
            ...props,
            notMixedAccounts,
            getRunningIndicator,
            toggleIsLegacy
          }}
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
