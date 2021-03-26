import { useEffect, useState } from "react";
import { PurchasePage } from "./Page";
import { usePurchaseTab } from "../hooks";
import { isEqual } from "lodash/fp";

const Tickets = ({ toggleIsLegacy }) => {
  const {
    spvMode,
    blocksNumberToNextTicket,
    sidebarOnBottom,
    isWatchingOnly,
    // TODO add retry wiith discoverAvailableVsps in case of failure:
    // discoverAvailableVSPs,
    availableVSPs,
    // TODO treat errors:
    // availableVSPsError,
    defaultSpendingAccount,
    ticketPrice,
    onPurchaseTicketV3,
    mixedAccount,
    changeAccount,
    isLoading,
    rememberedVspHost,
    setRememberedVspHost,
    notMixedAccounts,
    isVSPListingEnabled,
    onEnableVSPListing,
    getRunningIndicator,
    visibleAccounts,
    isPurchasingTicketsTrezor
  } = usePurchaseTab();

  const [account, setAccount] = useState(defaultSpendingAccount);
  useEffect(() => {
    const newAccount = visibleAccounts?.find((a) =>
      isEqual(a.value, account?.value)
    );
    newAccount && setAccount(newAccount);
  }, [visibleAccounts, account]);

  // todo use this vsp to buy solo tickets.
  const [vsp, setVSP] = useState(() => {
    if (rememberedVspHost) {
      // reset rememberedVspHost if it's outdated
      if (
        availableVSPs?.find(
          (availableVSP) => availableVSP.host === rememberedVspHost.host
        )?.outdated === true
      ) {
        setRememberedVspHost(null);
        return null;
      } else {
        return { host: rememberedVspHost.host };
      }
    } else {
      return null;
    }
  });
  const [numTicketsToBuy, setNumTicketsToBuy] = useState(1);
  const [isValid, setIsValid] = useState(false);

  const toggleRememberVspHostCheckBox = () => {
    setRememberedVspHost(!rememberedVspHost ? vsp : null);
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode == 38) {
      e.preventDefault();
      onIncrementNumTickets();
    } else if (e.keyCode == 40) {
      e.preventDefault();
      onDecrementNumTickets();
    }
  };

  const onIncrementNumTickets = () => {
    setNumTicketsToBuy((numTicketsToBuy) =>
      numTicketsToBuy == "" ? 1 : numTicketsToBuy + 1
    );
  };

  const onChangeNumTickets = (numTicketsToBuy) => {
    if (parseInt(numTicketsToBuy)) {
      setNumTicketsToBuy(parseInt(numTicketsToBuy));
    } else if (numTicketsToBuy == "") {
      setNumTicketsToBuy(numTicketsToBuy);
    }
  };

  const onDecrementNumTickets = () => {
    setNumTicketsToBuy((numTicketsToBuy) =>
      numTicketsToBuy <= 1 ? 1 : numTicketsToBuy - 1
    );
  };

  const onV3PurchaseTicket = (passphrase) => {
    onPurchaseTicketV3(passphrase, account, numTicketsToBuy, vsp);
  };

  useEffect(() => {
    const { spendable } = account;
    const canAfford = numTicketsToBuy * ticketPrice <= spendable;
    const hasTickets = numTicketsToBuy > 0;
    setIsValid(canAfford && hasTickets && !!vsp);
  }, [ticketPrice, numTicketsToBuy, account, vsp]);

  const [vspFee, setVspFee] = useState(
    availableVSPs &&
      availableVSPs.find((availableVSP) => availableVSP.host === vsp?.host)
        ?.vspData.feepercentage
  );

  return (
    <PurchasePage
      {...{
        spvMode,
        blocksNumberToNextTicket,
        sidebarOnBottom,
        isWatchingOnly,
        account,
        numTicketsToBuy,
        onIncrementNumTickets,
        onDecrementNumTickets,
        onChangeNumTickets,
        handleOnKeyDown,
        setAccount,
        ticketPrice,
        isValid,
        toggleIsLegacy,
        availableVSPs,
        setVSP,
        onV3PurchaseTicket,
        vsp,
        vspFee,
        setVspFee,
        mixedAccount,
        changeAccount,
        isLoading,
        rememberedVspHost,
        toggleRememberVspHostCheckBox,
        notMixedAccounts,
        isVSPListingEnabled,
        onEnableVSPListing,
        getRunningIndicator,
        isPurchasingTicketsTrezor
      }}
    />
  );
};

export default Tickets;
