import { usePrevious } from "helpers";
import { spring, Motion } from "react-motion";
import theme from "theme";
import { FormattedMessage as T } from "react-intl";
import sideBarStyle from "../SideBar.module.css";
import * as sel from "selectors";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

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

  const getAnimatedCaret = useMemo(() => {
    const style = sidebarOnBottom
      ? { ...sidebarOnBottomStyle }
      : { top: sidebarOnBottomStyle.top };
    return (
      <Motion style={style}>
        {(style) => <div className={sideBarStyle.menuCaret} {...{ style }} />}
      </Motion>
    );
  }, [sidebarOnBottom, sidebarOnBottomStyle]);

  const getStaticCaret = useMemo(() => {
    const { left, top } = sidebarOnBottomStyle;
    const style = sidebarOnBottom
      ? { left: left.val, top: top.val }
      : { top: top.val };
    return <div className={sideBarStyle.menuCaret} style={style} />;
  }, [sidebarOnBottom, sidebarOnBottomStyle]);

  return {
    uiAnimations,
    getAnimatedCaret,
    getStaticCaret,
    _nodes,
    sidebarOnBottom
  };
}

export function useMenuList(linkList) {
  const isTrezor = useSelector(sel.isTrezor);
  const lnEnabled = useSelector(sel.lnEnabled);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);

  const links = useRef([...linkList]);
  const LINK_PER_ROW = useRef(4);

  useEffect(() => {
    if (isTrezor) {
      links.current.push({
        path: "/trezor",
        link: <T id="sidebar.link.trezor" m="Trezor Setup" />,
        icon: "trezor"
      });
    }

    if (lnEnabled) {
      links.current.push({
        path: "/ln",
        link: <T id="sidebar.link.ln" m="Lightning Network" />,
        icon: "ln"
      });
    }
  }, [isTrezor, lnEnabled]);

  const linksComponents = useMemo(() => {
    let linksComponent = [];
    if (sidebarOnBottom) {
      let n = 0;
      const totalLinks = links.current.length;
      const numberOfRows = totalLinks / LINK_PER_ROW.current;
      for (let i = 0; i < numberOfRows && n < totalLinks; i++) {
        linksComponent[i] = [];
        for (let j = 0; j < LINK_PER_ROW.current && n < totalLinks; j++) {
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
