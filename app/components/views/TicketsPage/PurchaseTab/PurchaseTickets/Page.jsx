import UnsignedTickets from "../UnsignedTickets";
import StakeInfo from "../StakeInfo/StakeInfo";
import PurchaseForm from "./PurchaseForm";
import { ShowWarning, Subtitle, Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import styles from "../PurchaseTab.module.css";
import { Checkbox, classNames } from "pi-ui";
import { KeyBlueButton } from "buttons";
import TicketAutoBuyer from "../TicketAutoBuyer/TicketAutoBuyer";
import { useState } from "react";

export const LegacyVSPWarning = () => (
  <T
    id="purchase.isLegacyDescription"
    m="Use a VSP which has not updated to vspd. Not recommended, legacy VSP support will soon be removed."
  />
);

const PrivacyInfo = () => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.privacyInfo} onClick={() => setShow(!show)}>
      <T
        id="purchase.vsp.privacy.enabled"
        m="You are purchasing mixed tickets"
      />
      <div
        className={classNames(
          styles.readMoreIcon,
          show && styles.active
        )}
      />
      {show && (
        <T
          id="purchase.vsp.privacy.enabled.description"
          m="Purchasing mixed tickets can take some time because mix transactions are only created every 20 minutes. The Privacy And Security page contains more information regarding the mixing process."
        />
      )}
    </div>
  );
};

const TitleIcon = ({ toggleIsLegacy }) => (
  <div className={styles.iconWrapper}>
    {/* The div below is a placeholder for the info modal "i" icon which is not
        displayed on the new VSP form. Including this here ensures the layout is
        consistent and prevents things from moving then the "i" is hidden.
        This div can be removed when the legacy VSP form is removed. */}
    <div
      style={{
        width: "20px",
        height: "20px",
        padding: "3px",
        margin: "4px 0 4px 0"
      }}
    />
    <Tooltip md={true} text={<LegacyVSPWarning />}>
      <Checkbox
        label={<T id="purchase.isLegacy" m="Use Legacy VSP" />}
        className={styles.useLegacyLabel}
        id="box"
        checked={false}
        onChange={() => toggleIsLegacy(true)}
      />
    </Tooltip>
  </div>
);

const EnableVSP = ({ onEnableVSP }) => (
  <div className={styles.enableVSPWrapper}>
    <p className={styles.enableVSPMessage}>
      <T
        id="purchase.vsp.enableListing.description"
        m="VSP listing from external API endpoint is currently disabled. Please enable the access to this third party service or manually configure the VSP."
      />
    </p>
    <KeyBlueButton onClick={onEnableVSP} className={styles.enableVSPButton}>
      <T id="purchase.vsp.enableListing.button" m="Enable VSP Listing" />
    </KeyBlueButton>
  </div>
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
  vspFee,
  setVspFee,
  isValid,
  toggleIsLegacy,
  onV3PurchaseTicket,
  mixedAccount,
  changeAccount,
  isLoading,
  rememberedVspHost,
  toggleRememberVspHostCheckBox,
  onRevokeTickets,
  notMixedAccounts,
  isVSPListingEnabled,
  onEnableVSPListing,
  ...props
}) {
  return (
    <div className="purchase-ticket-area">
      <StakeInfo {...{ sidebarOnBottom }} />
      {!isVSPListingEnabled && <EnableVSP onEnableVSP={onEnableVSPListing} />}
      <Subtitle
        title={<T id="purchase.subtitle" m="Purchase Tickets" />}
        className="is-row">
        <TitleIcon toggleIsLegacy={toggleIsLegacy} />
      </Subtitle>
      {mixedAccount && changeAccount && <PrivacyInfo />}
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
            notMixedAccounts,
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
            vspFee,
            setVspFee,
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
