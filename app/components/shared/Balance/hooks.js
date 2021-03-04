import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useBalance() {
  const currencyDisplay = useSelector(sel.currencyDisplay);
  const unitDivisor = useSelector(sel.unitDivisor);
  return {
    currencyDisplay,
    unitDivisor
  };
}
