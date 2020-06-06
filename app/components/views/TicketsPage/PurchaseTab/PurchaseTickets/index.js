import { useEffect, useState } from "react";
import { PurchasePage } from "./Page";
import {
  usePurchaseTab
} from "../hooks";

const Tickets = ({ toggleIsLegacy }) => {
  const {
    spvMode,
    blocksNumberToNextTicket,
    sidebarOnBottom,
    isWatchingOnly,
    discoverAvailableVSPs,
    defaultSpendingAccount,
    spendingAccounts,
    ticketPrice
  } = usePurchaseTab();

  const [account, setAccount] = useState(defaultSpendingAccount);
  const [vsp, setVSP] = useState(null);
  const [numTickets, setNumTickets] = useState(1);
  const [vspOptions, setVSPOptions] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // onChangeNumTickets deals with ticket increment or decrement.
  const onChangeNumTickets = (increment) => {
    if (numTickets === 0 && !increment) return;
    increment ? setNumTickets(numTickets + 1) : setNumTickets(numTickets -1);
  };

  useEffect(() => {
    const { spendable } = account;
    const canAfford = numTickets * ticketPrice <= spendable;
    const hasTickets = numTickets > 0;
    setIsValid(canAfford && hasTickets);
  }, [ticketPrice, numTickets]);

  useEffect(() => {
    const getAvailableVsps = async () => {
      const options = await discoverAvailableVSPs();
      // filter vsp which support API v3.
      const filteredOpts = options.reduce((filtered, vsp) => {
        if (vsp.APIVersionsSupported.indexOf(3) > -1) {
          filtered.push(vsp);
        }
        return filtered;
      }, []);

      return filteredOpts;
    };

    getAvailableVsps().then(filtered => {
      return setVSPOptions(filtered);
    });
  }, [discoverAvailableVSPs]);

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
      vspOptions,
      account,
      numTickets,
      onChangeNumTickets,
      setNumTickets,
      handleOnKeyDown,
      setAccount,
      ticketPrice,
      setVSP,
      isValid,
      toggleIsLegacy
    }} />;
};

export default Tickets;
