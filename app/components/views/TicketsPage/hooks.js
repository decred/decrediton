import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useTicketsPage = () => {
  const ticketPrice = useSelector(sel.ticketPrice);
  return {
    ticketPrice
  };
};
