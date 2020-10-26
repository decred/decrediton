import { useEffect, useState } from "react";
import { PurchasePage } from "./Page";
import { usePurchaseTab } from "../hooks";

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
    onRevokeTickets
  } = usePurchaseTab();

  const [account, setAccount] = useState(defaultSpendingAccount);
  // todo use this vsp to buy solo tickets.
  const [vsp, setVSP] = useState(buyerVSP);
  const [numTickets, setNumTickets] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [rememberVsp, setRememberVsp] = useState(false);

  const toggleRememberVsp = () => {
    setRememberVsp(!rememberVsp);
  };

  // onChangeNumTickets deals with ticket increment or decrement.
  const onChangeNumTickets = (increment) => {
    if (numTickets === 0 && !increment) return;
    increment ? setNumTickets(numTickets + 1) : setNumTickets(numTickets -1);
  };

  const onV3PurchaseTicket = (passphrase) => {
    onPurchaseTicketV3(passphrase, account, numTickets, vsp, rememberVsp);
  };

  useEffect(() => {
    const { spendable } = account;
    const canAfford = numTickets * ticketPrice <= spendable;
    const hasTickets = numTickets > 0;
    setIsValid(canAfford && hasTickets && !!vsp);
  }, [ticketPrice, numTickets, account, vsp]);

  const handleOnKeyDown = (e) => {
    if (e.keyCode == 38) {
      e.preventDefault();
      onChangeNumTickets(true);
    } else if (e.keyCode == 40) {
      e.preventDefault();
      onChangeNumTickets(false);
    }
  };

  return <PurchasePage {...{
      spvMode,
      blocksNumberToNextTicket,
      sidebarOnBottom,
      isWatchingOnly,
      account,
      numTickets,
      onChangeNumTickets,
      setNumTickets,
      handleOnKeyDown,
      setAccount,
      ticketPrice,
      isValid,
      toggleIsLegacy,
      availableVSPs,
      setVSP,
      onV3PurchaseTicket,
      vsp,
      mixedAccount,
      changeAccount,
      rememberVsp,
      toggleRememberVsp
      isLoading,
      onRevokeTickets
    }} />;
};

export default Tickets;
