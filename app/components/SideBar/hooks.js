import MenuLink from "./MenuLink";
import { createElement as h, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { usePrevious } from "helpers"
import { spring, Motion } from "react-motion";
import theme from "theme";
import { FormattedMessage as T } from "react-intl";
import sideBarStyle from "./SideBar.module.css"

export function useSideBar() {
  const [isShowingAccounts, setIsShowingAccounts] = useState(false);

  const onShowAccounts = useCallback(() => {
    setIsShowingAccounts(true);
  }, [setIsShowingAccounts]);

  const onHideAccounts = useCallback(() => {
    setIsShowingAccounts(false);
  }, [setIsShowingAccounts]);

  return { isShowingAccounts, onShowAccounts, onHideAccounts };
}

export function useLastBlockTime(lastBlockTimestamp, clearTimeout, setTimeout) {
  const [state, setState] = useState(null);

  const getBlockDate = useCallback((lastBlockTimestamp) => {
    let lastBlockDate;
    let lastBlockIsRecent = false;
    let updateRecentTimer = state ? state.updateRecentTimer : null;

    if (lastBlockTimestamp) {
      if (updateRecentTimer) {
        clearTimeout(updateRecentTimer);
        updateRecentTimer = null;
      }

      const now = new Date();
      lastBlockDate = new Date(lastBlockTimestamp * 1000);
      const timeFromLastBlock = now.getTime() - lastBlockDate.getTime();
      lastBlockIsRecent = timeFromLastBlock < 60000;
      if (lastBlockIsRecent) {
        updateRecentTimer = setTimeout(
          () => { setState(getBlockDate(lastBlockTimestamp)) },
          60000 - timeFromLastBlock
        );
      }
    }
    return { lastBlockDate, lastBlockIsRecent, updateRecentTimer };
  }, [state, setState]);

  useEffect(() => {
    setState(getBlockDate(lastBlockTimestamp))
  }, [lastBlockTimestamp]);

  return { state };
}

export function useMenuLinks(sidebarOnBottom,
  location,
  isTrezor,
  lnEnabled,
  linkList,
  LINK_PER_ROW,
  props) {

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [selectedTab, setSelectedTab] = useState(null);

  const links = useRef([...linkList]);
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
  }, [sidebarOnBottom, _nodes]);

  const updateCaretPosition = useCallback(() => {
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTabAux =
      tabbedPageCheck > 0
        ? location.pathname.substring(0, tabbedPageCheck)
        : location.pathname;
    const caretPosition = neededCaretPosition(selectedTabAux);
    if (caretPosition) {
      setTop(caretPosition.top);
      setLeft(caretPosition.left);
      setSelectedTab(selectedTabAux);
    }
  }, [
    location,
    neededCaretPosition,
    setTop,
    setLeft,
    setSelectedTab
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
    updateCaretPosition();
  }, []);

  const getAnimatedCaret = useMemo(() => {
    const style = sidebarOnBottom
      ? { left: left, top: top }
      : { top: top };
    return (
      <Motion style={style}>
        {(style) => <div className={sideBarStyle.menuCaret} {...{ style }} />}
      </Motion>
    );
  }, [sidebarOnBottom, left, top]);

  const getStaticCaret = useMemo(() => {
    const style = sidebarOnBottom
      ? { left: left.val, top: top.val }
      : { top: top.val };
    return <div className={sideBarStyle.menuCaret} style={style} />;
  }, [sidebarOnBottom, left, top]);

  const getMenuLink = useCallback((linkItem) => {
    const { path, link, icon, notifProp } = linkItem;
    const hasNotif = notifProp ? props[notifProp] : false;

    return (
      <MenuLink
        icon={icon}
        to={path}
        key={path}
        hasNotification={hasNotif}
        linkRef={(ref) => _nodes.current.set(path, ref)}>
        {!sidebarOnBottom && link}
      </MenuLink>
    );
  }, [props.notifProp, _nodes, sidebarOnBottom]);

  const getLinks = useCallback(() => {
    let linksComponent = [];
    if (sidebarOnBottom) {
      const numberOfRows = links.current.length / LINK_PER_ROW;
      let n = 0;
      const totalLinks = links.current.length;
      for (let i = 0; i < numberOfRows && n < totalLinks; i++) {
        linksComponent[i] = [];
        for (let j = 0; j < LINK_PER_ROW && n < totalLinks; j++) {
          linksComponent[i].push(getMenuLink(links.current[n]));
          n++;
        }
        linksComponent[i] = h(
          "div",
          { className: "is-row", key: i },
          linksComponent[i]
        );
      }
      return linksComponent;
    }

    return (linksComponent = links.current.map((link) => getMenuLink(link)));
  }, [sidebarOnBottom, links, getMenuLink]);

  return {
    getAnimatedCaret,
    getStaticCaret,
    getLinks
  };
}
