import { usePrevious } from "helpers";
import { spring } from "react-motion";
import theme from "theme";
import * as sel from "selectors";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { trezorLink, lnLink } from "./Links";
import { MENU_LINKS_PER_ROW } from "../../../constants/Decrediton";

export function useMenuLinks() {
  const location = useSelector(sel.location);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const uiAnimations = useSelector(sel.uiAnimations);

  const [sidebarOnBottomStyle, setSidebarOnBottomStyle] = useState({ top: 0, left: 0 });
  const [selectedTab, setSelectedTab] = useState(null);

  const _nodes = useRef(new Map());

  const neededCaretPosition = useCallback((path) => {
    const tabForRoute = _nodes.current.get(path);
    if (!tabForRoute) return null;
    if (sidebarOnBottom) {
      const newLeft = tabForRoute.offsetLeft;
      const newTop = tabForRoute.offsetTop;
      return { left: spring(newLeft, theme("springs.sideBar")), top: newTop };
    }
    const newTop = tabForRoute.offsetTop;
    return { top: spring(newTop, theme("springs.sideBar")), left: 0 };
  }, [sidebarOnBottom]);

  const updateCaretPosition = useCallback(() => {
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTab =
      tabbedPageCheck > 0
        ? location.pathname.substring(0, tabbedPageCheck)
        : location.pathname;
    const caretPosition = neededCaretPosition(selectedTab);
    if (caretPosition) {
      setSidebarOnBottomStyle(caretPosition);
      setSelectedTab(selectedTab);
    }
  }, [
    location,
    neededCaretPosition
  ]);

  const previousSidebarOnBottom = usePrevious(sidebarOnBottom);

  useEffect(() => updateCaretPosition(), [updateCaretPosition]);

  useEffect(() => {
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTabAux =
      tabbedPageCheck > 0
        ? location.pathname.substring(0, tabbedPageCheck)
        : location.pathname;
    if (
      selectedTabAux !== selectedTab ||
      sidebarOnBottom !== previousSidebarOnBottom
    ) {
      updateCaretPosition();
    }
  }, [updateCaretPosition, sidebarOnBottom, previousSidebarOnBottom, selectedTab, location]);

  const caretStyle = useMemo(() => {
    return uiAnimations ? sidebarOnBottom
      ? { ...sidebarOnBottomStyle }
      : { top: sidebarOnBottomStyle.top } : sidebarOnBottom
        ? { left: sidebarOnBottomStyle.left.val, top: sidebarOnBottomStyle.top.val }
        : { top: sidebarOnBottomStyle.top.val };
  }, [uiAnimations, sidebarOnBottom, sidebarOnBottomStyle]);

  return {
    uiAnimations,
    caretStyle,
    _nodes,
    sidebarOnBottom
  };
}

export function useMenuList(linkList) {
  const isTrezor = useSelector(sel.isTrezor);
  const lnEnabled = useSelector(sel.lnEnabled);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);

  const links = useRef([...linkList]);

  useEffect(() => {
    if (isTrezor) {
      links.current.push(trezorLink);
    }
    if (lnEnabled) {
      links.current.push(lnLink);
    }
  }, [isTrezor, lnEnabled]);

  const linksComponents = useMemo(() => {
    let linksComponent = [];
    if (sidebarOnBottom) {
      let n = 0;
      const totalLinks = links.current.length;
      const numberOfRows = totalLinks / MENU_LINKS_PER_ROW;
      for (let i = 0; i < numberOfRows && n < totalLinks; i++) {
        linksComponent[i] = [];
        for (let j = 0; j < MENU_LINKS_PER_ROW && n < totalLinks; j++) {
          linksComponent[i].push(links.current[n]);
          n++;
        }
      }
      return linksComponent;
    }

    return (linksComponent = links.current.map((link) => link));
  }, [sidebarOnBottom]);

  return {
    sidebarOnBottom,
    linksComponents
  };
}
