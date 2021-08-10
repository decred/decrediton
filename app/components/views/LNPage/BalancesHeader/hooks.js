import * as sel from "selectors";
import { useSelector } from "react-redux";

export function useBalancesHeader() {
  const channelBalances = useSelector(sel.lnChannelBalances);

  return {
    channelBalances
  };
}
