import { usePrevious } from "helpers";
import { spring } from "react-motion";
import theme from "theme";
import * as sel from "selectors";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { trezorLink, lnLink } from "./Links";
import { MENU_LINKS_PER_ROW } from "../../../constants/Decrediton";

export function useMenuLinks(linkList) {
  const location = useSelector(sel.location);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const uiAnimations = useSelector(sel.uiAnimations);
  const isTrezor = useSelector(sel.isTrezor);
  const lnEnabled = useSelector(sel.lnEnabled);

  const newActiveVoteProposalsCount = useSelector(sel.newActiveVoteProposalsCount);
  const newPreVoteProposalsCount = useSelector(sel.newPreVoteProposalsCount);
  const newProposalsStartedVoting = useSelector(sel.newProposalsStartedVoting);

  const notifProps = useMemo(() => ({
    newActiveVoteProposalsCount,
    newPreVoteProposalsCount,
    newProposalsStartedVoting
  }), [
    newActiveVoteProposalsCount,
    newPreVoteProposalsCount,
    newProposalsStartedVoting
  ]);

  const [caretStyle, setCaretStyle] = useState({ top: 0, left: 0 });
  const [selectedTab, setSelectedTab] = useState(null);

  const nodes = useRef(new Map());
  const links = useRef([
    ...linkList,
    ...(isTrezor ? [trezorLink] : []),
    ...(lnEnabled ? [lnLink] : [])
  ]);

  const neededCaretPosition = useCallback((path) => {
    const tabForRoute = nodes.current.get(path);
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
      setCaretStyle(caretPosition);
      setSelectedTab(selectedTab);
    }
  }, [
    location,
    neededCaretPosition
  ]);

  const previousSidebarOnBottom = usePrevious(sidebarOnBottom);

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

  const caretStyleMemo = useMemo(() => {
    if (uiAnimations) {
      return sidebarOnBottom
        ? { ...caretStyle }
        : { top: caretStyle.top };
    } else {
      const { top, left } = caretStyle;
      return sidebarOnBottom
        ? { left: left.val, top: top.val }
        : { top: top.val };
    }
  }, [uiAnimations, sidebarOnBottom, caretStyle]);

  const menuLinks = useMemo(() => {
    let linksComponent = [];
    if (sidebarOnBottom) {
      let n = 0;
      const totalLinks = links.current.length;
      const numberOfRows = totalLinks / MENU_LINKS_PER_ROW;
      for (let i = 0; i < numberOfRows && n < totalLinks; i++) {
        linksComponent[i] = [];
        for (let j = 0; j < MENU_LINKS_PER_ROW && n < totalLinks; j++) {
          links.current[n].notifProp = notifProps[links.current[n].notifProp];
          linksComponent[i].push(links.current[n]);
          n++;
        }
      }
      return linksComponent;
    }

    return (linksComponent = links.current.map((link) => {
      link.notifProp = notifProps[link.notifProp];
      return link;
    }));
  }, [sidebarOnBottom, notifProps]);

  return {
    uiAnimations,
    caretStyle: caretStyleMemo,
    nodes: nodes.current,
    sidebarOnBottom,
    menuLinks
  };
}
