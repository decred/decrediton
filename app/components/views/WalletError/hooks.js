import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useWalletError = () => {
  const getNetworkError = useSelector(sel.getNetworkError);

  return { getNetworkError };
};
