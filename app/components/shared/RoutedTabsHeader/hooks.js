import { useEffect, useCallback, useState, useRef } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useRoutedTabsHeader() {
  const nodes = useRef(new Map());
  const [caretLeft, setCaretLeft] = useState(null);
  const [caretWidth, setCaretWidth] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [localSidebarOnBottom, setLocalSidebarOnBottom] = useState(null);
  const { pathname } = useSelector(sel.location);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const uiAnimations = useSelector(sel.uiAnimations);

  const updateCaretPosition = useCallback(() => {
    const selectedTab = pathname;
    const tabForRoute = nodes.current.get(selectedTab);
    if (!tabForRoute) return null;
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft;
    const caretWidth = tabRect.width;
    setCaretLeft(caretLeft);
    setCaretWidth(caretWidth);
    setSelectedTab(selectedTab);
  }, [pathname]);

  useEffect(() => {
    setLocalSidebarOnBottom(sidebarOnBottom);
    updateCaretPosition();
  }, [sidebarOnBottom, updateCaretPosition]);

  useEffect(() => {
    if (selectedTab != pathname || localSidebarOnBottom != sidebarOnBottom) {
      updateCaretPosition();
    }
  }, [
    pathname,
    selectedTab,
    sidebarOnBottom,
    localSidebarOnBottom,
    updateCaretPosition
  ]);

  return { uiAnimations, caretLeft, caretWidth, nodes };
}
