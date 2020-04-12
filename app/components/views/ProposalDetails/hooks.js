import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useProposalDetails = () => {
  const tsDate = useSelector(sel.tsDate);
  const hasTickets = useSelector(sel.hasTickets);
  return { tsDate, hasTickets };
};
