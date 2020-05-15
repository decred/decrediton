import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useTreasuryInfo = () => {
  const treasuryBalance = useSelector(sel.treasuryBalance);
  return { treasuryBalance };
};
