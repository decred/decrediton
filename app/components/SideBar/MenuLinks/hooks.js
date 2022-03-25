import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { linkList, TREZOR_KEY, LN_KEY, DEX_KEY } from "./Links";
import { useHistory } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import { cloneDeep } from "fp";

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
  const useDexSpvExperimental = useSelector(sel.useDexSpvExperimental);
  const newNotYetVotedAgendasCount = useSelector(
    sel.newNotYetVotedAgendasCount
  );
  const newNotYetVotedActiveProposalsCount = useSelector(
    sel.newNotYetVotedActiveProposalsCount
  );

  const notifProps = useMemo(
    () => ({
      newActiveVoteProposalsCount,
      newPreVoteProposalsCount,
      newProposalsStartedVoting: newProposalsStartedVoting ? 1 : 0,
      newNotYetVotedAgendasCount,
      newNotYetVotedActiveProposalsCount
    }),
    [
      newActiveVoteProposalsCount,
      newPreVoteProposalsCount,
      newProposalsStartedVoting,
      newNotYetVotedAgendasCount,
      newNotYetVotedActiveProposalsCount
    ]
  );

  const menuLinks = useMemo(() => {
    let links = cloneDeep(linkList);
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
        if (l.key === DEX_KEY && !useDexSpvExperimental) {
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
    return links.map((link) => ({
      ...link,
      notifProp: link.notifProp?.reduce(
        (acc, np) => acc + (notifProps[np] || 0),
        0
      )
    }));
  }, [notifProps, isTrezor, lnEnabled, isSPV, useDexSpvExperimental]);

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
