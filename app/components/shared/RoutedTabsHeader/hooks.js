import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useRoutedTabsHeader() {
  const location = useSelector(sel.location);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const uiAnimations = useSelector(sel.uiAnimations);

  return {
    location,
    sidebarOnBottom,
    uiAnimations
  };
};
