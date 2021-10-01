import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { linkList, TREZOR_KEY, LN_KEY, DEX_KEY } from "./Links";
import { useHistory } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";

export function useMenuLinks() {
  const location = useSelector(sel.location);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const expandSideBar = useSelector(sel.expandSideBar);
  const isTrezor = useSelector(sel.isTrezor);
  const lnEnabled = useSelector(sel.lnEnabled);
  const isSPV = useSelector(sel.isSPV);

  const newActiveVoteProposalsCount = useSelector(
    sel.newActiveVoteProposalsCount
  );
  const newPreVoteProposalsCount = useSelector(sel.newPreVoteProposalsCount);
  const newProposalsStartedVoting = useSelector(sel.newProposalsStartedVoting);

  const notifProps = useMemo(
    () => ({
      newActiveVoteProposalsCount,
      newPreVoteProposalsCount,
      newProposalsStartedVoting
    }),
    [
      newActiveVoteProposalsCount,
      newPreVoteProposalsCount,
      newProposalsStartedVoting
    ]
  );

  const prepareLinkList = () => {
    let links = linkList;
    if (!isTrezor) {
      links = links.filter((l) => l.key !== TREZOR_KEY);
    }
    if (!lnEnabled) {
      links = links.filter((l) => l.key !== LN_KEY);
    }
    if (isTrezor) {
      links = links.filter((l) => l.key !== DEX_KEY);
    }
    if (isSPV) {
      links = links.map((l) => {
        if (l.key === DEX_KEY) {
          l.disabled = true;
          l.tooltip = (
            <T
              id="sidebar.link.disabledDexTooltip"
              m="DEX not available while using SPV. Please go to settings and disable SPV to access the DEX."
            />
          );
        }
        return l;
      });
    }

    return links;
  };

  const links = useRef(prepareLinkList());
  const menuLinks = useMemo(() => {
    return links.current.map((link) => {
      return { ...link, notifProp: notifProps[link.notifProp] };
    });
  }, [notifProps]);

  const [activeTabIndex, setActiveTabIndex] = useState(-1);
  const history = useHistory();
  const onSelectTab = (index) => {
    if (!menuLinks[index].disabled) {
      setActiveTabIndex(index);
      history.push(menuLinks[index].path);
    }
  };

  useEffect(() => {
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTabAux =
      tabbedPageCheck > 0
        ? location.pathname.substring(0, tabbedPageCheck)
        : location.pathname;
    const tabIndex = menuLinks.findIndex(
      (menuLink) => menuLink.path === selectedTabAux
    );
    if (tabIndex !== activeTabIndex) {
      setActiveTabIndex(tabIndex);
    }
  }, [location, activeTabIndex, menuLinks]);

  return {
    sidebarOnBottom,
    menuLinks,
    expandSideBar,
    onSelectTab,
    activeTabIndex
  };
}
