import { useSelector } from "react-redux";
import * as sel from "selectors";

const useService = () => {
  const walletService = useSelector(sel.walletService);
  const ticketBuyerService = useSelector(sel.ticketBuyerService);
  const isMainNet = useSelector(sel.isMainNet);
  const isTestNet = useSelector(sel.isTestNet);
  return { walletService, ticketBuyerService, isMainNet, isTestNet };
};

export default useService;
