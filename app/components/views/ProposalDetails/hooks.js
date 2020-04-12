import { useSelector } from "react-redux";
import { useState } from "react";
import * as sel from "selectors";

export const useProposalDetails = () => {
  const tsDate = useSelector(sel.tsDate);
  const hasTickets = useSelector(sel.hasTickets);
  const [ showWalletEligibleTickets, toggleWalletEligibleTickets ] = useState(false);
  return { tsDate, hasTickets, showWalletEligibleTickets, toggleWalletEligibleTickets };
};
