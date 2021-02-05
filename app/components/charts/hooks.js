import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useChart() {
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const currencyDisplay = useSelector(sel.currencyDisplay);
  const unitDivisor = useSelector(sel.unitDivisor);

  return {
    sidebarOnBottom,
    currencyDisplay,
    unitDivisor
  };
}
