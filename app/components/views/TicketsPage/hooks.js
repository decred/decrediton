import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";

export const useTicketsPage = () => {
  const ticketPrice = useSelector(sel.ticketPrice);
  const showStakingWarning = useSelector(sel.showStakingWarning);

  const dispatch = useDispatch();
  const onAcceptStakingWarning = useCallback(() => {
    dispatch(wla.acceptStakingWarning());
  }, [dispatch]);

  return {
    ticketPrice,
    showStakingWarning,
    onAcceptStakingWarning
  };
};
