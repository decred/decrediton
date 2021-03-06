import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useInvalidRPC = () => {
  const requiredWalletRPCVersion = useSelector(sel.requiredWalletRPCVersion);
  const walletRPCVersion = useSelector(sel.walletRPCVersion);

  return {
    requiredWalletRPCVersion,
    walletRPCVersion
  };
};
