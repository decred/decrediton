import PurchaseTickets from "./LEGACY_PurchaseTickets";
import TicketAutoBuyer from "./LEGACY_TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "../StakeInfo/StakeInfo";
import { ShowWarning, Subtitle } from "shared";
import "style/PurchaseTickets.less";
import { InfoDocModalButton } from "buttons";
import UnsignedTickets from "../UnsignedTickets";
import styles from "../PurchaseTab.module.css";
import { Checkbox } from "pi-ui";

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
    <div className={styles.iconWrapper}>
      <InfoDocModalButton
        document="PurchaseTicketsInfo"
        modalClassName={styles.infoFields}
        className="info-title-icon"
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
    <div className="purchase-ticket-area">
      <StakeInfo {...{ sidebarOnBottom }} />
      <Subtitle
        title={<T id="purchase.subtitle.legacy" m="Purchase Tickets" />}
        children={getTitleIcon({ toggleIsLegacy })}
        className="is-row"
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
        <PurchaseTickets {...{ ...props, notMixedAccounts, getRunningIndicator }} />
      )}
      {isWatchingOnly ? (
        <UnsignedTickets {...{ ...props }} />
      ) : spvMode ? (
        <div className="spv-autobuyer-warning">
          <T
            id="spv.auto.buyer.warn"
            m="Ticket Auto Buyer not available while using SPV"
          />
        </div>
      ) : (
        <TicketAutoBuyer {...{ ...props, notMixedAccounts, getRunningIndicator }} />
      )}
    </div>
  );
};

export default Tickets;
