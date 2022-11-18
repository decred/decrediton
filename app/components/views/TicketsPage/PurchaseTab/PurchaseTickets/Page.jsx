import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import UnsignedTickets from "../UnsignedTickets";
import StakeInfo from "../StakeInfo";

import { PurchaseTicketsForm } from "shared";
import { ShowWarning, Subtitle } from "shared";
import styles from "../PurchaseTab.module.css";
import { KeyBlueButton } from "buttons";
import TicketAutoBuyer from "../TicketAutoBuyer";

const PrivacyInfo = () => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.privacyInfo} onClick={() => setShow(!show)}>
      <T
        id="purchase.vsp.privacy.enabled"
        m="You are purchasing mixed tickets"
      />
      <div className={classNames(styles.readMoreIcon, show && styles.active)} />
      {show && (
        <T
          id="purchase.vsp.privacy.enabled.description"
          m="Purchasing mixed tickets can take some time because mix transactions are only created every 20 minutes. The Privacy And Security page contains more information regarding the mixing process."
        />
      )}
    </div>
  );
};

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
  numTicketsToBuy,
  onIncrementNumTickets,
  onDecrementNumTickets,
  onChangeNumTickets,
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
  notMixedAccounts,
  isVSPListingEnabled,
  onEnableVSPListing,
  getRunningIndicator,
  ...props
}) {
  return (
    <div className={styles.purchaseTicketArea}>
      <StakeInfo {...{ sidebarOnBottom }} />
      {!isVSPListingEnabled && <EnableVSP onEnableVSP={onEnableVSPListing} />}
      <Subtitle
        title={<T id="purchase.subtitle" m="Purchase Tickets" />}
        docUrl="https://docs.decred.org/wallets/decrediton/using-decrediton/#purchase-tickets"
      />
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
        <PurchaseTicketsForm
          {...{
            spvMode,
            notMixedAccounts,
            ticketPrice,
            setAccount,
            handleOnKeyDown,
            availableVSPs,
            account,
            numTicketsToBuy,
            onIncrementNumTickets,
            onDecrementNumTickets,
            onChangeNumTickets,
            setVSP,
            vsp,
            vspFee,
            setVspFee,
            isValid,
            onPurchaseTickets: onV3PurchaseTicket,
            isLoading,
            rememberedVspHost,
            toggleRememberVspHostCheckBox,
            getRunningIndicator,
            toggleIsLegacy,
            isLegacy: false
          }}
        />
      )}
      {isWatchingOnly && <UnsignedTickets {...{ ...props }} />}
      <TicketAutoBuyer />
    </div>
  );
}
