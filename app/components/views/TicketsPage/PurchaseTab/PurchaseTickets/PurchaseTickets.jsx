import { useEffect, useState } from "react";
import { PurchasePage } from "./Page";
import { usePurchaseTab } from "../hooks";

const Tickets = () => {
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
    account,
    setAccount,
    vsp,
    setVSP,
    numTicketsToBuy,
    setNumTicketsToBuy
  } = usePurchaseTab();

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
    setNumTicketsToBuy(numTicketsToBuy == "" ? 1 : numTicketsToBuy + 1);
  };

  const onChangeNumTickets = (numTicketsToBuy) => {
    if (parseInt(numTicketsToBuy)) {
      setNumTicketsToBuy(parseInt(numTicketsToBuy));
    } else if (numTicketsToBuy == "") {
      setNumTicketsToBuy(numTicketsToBuy);
    }
  };

  const onDecrementNumTickets = () => {
    setNumTicketsToBuy(numTicketsToBuy <= 1 ? 1 : numTicketsToBuy - 1);
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
        getRunningIndicator
      }}
    />
  );
};

export default Tickets;
