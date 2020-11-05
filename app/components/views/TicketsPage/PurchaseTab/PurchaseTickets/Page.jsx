import UnsignedTickets from "../UnsignedTickets";
import StakeInfo from "../StakeInfo/StakeInfo";
import PrivacyInfo from "../PrivacyInfo/PrivacyInfo";
import PurchaseForm from "./PurchaseForm";
import { ShowWarning, Subtitle, Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import styles from "../PurchaseTab.module.css";
import { classNames } from "pi-ui";
import TicketAutoBuyer from "../TicketAutoBuyer/TicketAutoBuyer";

export const LegacyVSPWarning = () => (
  <T
    id="purchase.isLegacyDescription"
    m="Use a VSP which has not updated to vspd. Not recommended, legacy VSP support will soon be removed."
  />
);

const getTitleIcon = ({ toggleIsLegacy }) => (
  <>
    <div className={classNames(styles.iconWrapper, styles.checkbox)}>
      <Tooltip md={true} text={<LegacyVSPWarning />}>
        <div className={styles.label}>
          <T id="purchase.isLegacy" m="Use Legacy VSP" />
        </div>
      </Tooltip>
      <input
        id="box"
        type="checkbox"
        checked={false}
        onChange={() => toggleIsLegacy(true)}
        />
      <label htmlFor="box" className={styles.checkboxLabel}></label>
    </div>
    {/* The div below is a placeholder for the info modal "i" icon which is not
        displayed on the new VSP form. Including this here ensures the layout is
        consistent and prevents things from moving then the "i" is hidden.
        This div can be removed when the legacy VSP form is removed. */}
    <div style={{ width: "20px", height: "20px", padding: "3px", margin: "4px 0 4px 0" }}></div>
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
  vsp,
  isValid,
  toggleIsLegacy,
  onV3PurchaseTicket,
  mixedAccount,
  changeAccount,
  isLoading,
  rememberedVspHost,
  toggleRememberVspHostCheckBox,
  onRevokeTickets,
  ...props
}) {
  return (
    <div className="purchase-ticket-area">
      <StakeInfo {...{ sidebarOnBottom }} />
      <Subtitle
        title={<T id="purchase.subtitle" m="Purchase Tickets" />}
        children={getTitleIcon({ toggleIsLegacy })}
        className="is-row"
      />
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
            vsp,
            isValid,
            onV3PurchaseTicket,
            isLoading,
            rememberedVspHost,
            toggleRememberVspHostCheckBox,
            onRevokeTickets
          }}
        />
      )}
      {isWatchingOnly && <UnsignedTickets {...{ ...props }} />}
      <TicketAutoBuyer />

    </div>
  );
}
