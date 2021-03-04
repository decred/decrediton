import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useFeeInput() {
  const currencyDisplay = useSelector(sel.currencyDisplay);
  return {
    currencyDisplay
  };
}
