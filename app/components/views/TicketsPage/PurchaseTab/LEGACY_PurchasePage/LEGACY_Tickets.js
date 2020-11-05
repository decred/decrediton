import PurchaseTickets from "./LEGACY_PurchaseTickets";
import TicketAutoBuyer from "./LEGACY_TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "../StakeInfo/StakeInfo";
import { ShowWarning, Subtitle, Tooltip } from "shared";
import "style/PurchaseTickets.less";
import { InfoDocModalButton } from "buttons";
import UnsignedTickets from "../UnsignedTickets";
import styles from "../PurchaseTab.module.css";
import { classNames } from "pi-ui";
import { LegacyVSPWarning } from "../PurchaseTickets/Page";

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
  <div className={classNames(styles.iconWrapper, styles.checkbox)}>
      <Tooltip md={true} text={<LegacyVSPWarning />}>
        <div className={styles.label}>
          <T id="purchase.isLegacy.legacy" m="Use Legacy VSP" />
        </div>
      </Tooltip>
      <input
        id="box"
        type="checkbox"
        checked={true}
        onChange={() => toggleIsLegacy(false)}
        />
      <label htmlFor="box" className={styles.checkboxLabel}></label>
    </div>
    <InfoDocModalButton
      document="PurchaseTicketsInfo"
      modalClassName={styles.infoFields}
      className="info-title-icon"
      draggable
    />
  </>
);

const Tickets = ({
  spvMode,
  blocksNumberToNextTicket,
  sidebarOnBottom,
  isWatchingOnly,
  toggleIsLegacy,
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
          <PurchaseTickets {...{ ...props }} />
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
            <TicketAutoBuyer {...{ ...props }} />
          )}
    </div>
  );
};

export default Tickets;
