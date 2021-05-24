import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { linkList, TREZOR_KEY, LN_KEY, DEX_KEY } from "./Links";
import { useHistory } from "react-router-dom";

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

  const isTicketAutoBuyerEnabled = useSelector(sel.getTicketAutoBuyerRunning);
  const isLegacyTicketAutobuyerEnabled = useSelector(
    sel.isTicketAutoBuyerEnabled
  );
  const isTicketsPurchaseAttempt = useSelector(
    sel.purchaseTicketsRequestAttempt
  );
  const isStakingBackgroundBusy =
    isTicketAutoBuyerEnabled ||
    isLegacyTicketAutobuyerEnabled ||
    isTicketsPurchaseAttempt;
  // Useful to handle the case staking backgroundBusy on => off.
  const isStakingBackgroundBusyRef = useRef(isStakingBackgroundBusy);

  const isMixerRunning = useSelector(sel.getAccountMixerRunning);
  // Useful to handle the case on => off.
  const isMixerRunningRef = useRef(isMixerRunning);

  const prepareLinkList = () => {
    let links = linkList;
    if (!isTrezor) {
      links = links.filter(({ type }) => type !== TREZOR_KEY);
    }
    if (!lnEnabled) {
      links = links.filter(({ type }) => type !== LN_KEY);
    }
    if (isSPV || isTrezor) {
      links = links.filter(({ type }) => type !== DEX_KEY);
    }

    return links;
  };

  const links = useRef(prepareLinkList());
  const menuLinks = useMemo(
    () =>
      links.current.map((link) => ({
        ...link,
        notifProp: notifProps[link.notifProp]
      })),
    [notifProps]
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const history = useHistory();
  const onSelectTab = (index) => {
    setActiveTabIndex(index);
    history.push(menuLinks[index].path);
  };

  // Populates backgroundBusy field values for menu links.
  useEffect(() => {
    // Mixer off => on.
    if (isMixerRunning && !isMixerRunningRef.current) {
      const privacyMenuItem = menuLinks.find(({ type }) => type === "privacy");
      privacyMenuItem.backgroundBusy = true;
      isMixerRunningRef.current = true;
    } else if (!isMixerRunning && isMixerRunningRef.current) {
      // Mixer on => off.
      const privacyMenuItem = menuLinks.find(({ type }) => type === "privacy");
      privacyMenuItem.backgroundBusy = false;
      isMixerRunningRef.current = false;
    } else if (isStakingBackgroundBusy && !isStakingBackgroundBusyRef.current) {
      // Staking backgroundBusy false => true
      const stakingMenuItem = menuLinks.find(({ type }) => type === "tickets");
      stakingMenuItem.backgroundBusy = true;
      isStakingBackgroundBusyRef.current = true;
    } else if (!isStakingBackgroundBusy && isStakingBackgroundBusyRef.current) {
      // Staking backgroundBusy false => true
      const stakingMenuItem = menuLinks.find(({ type }) => type === "tickets");
      stakingMenuItem.backgroundBusy = false;
      isStakingBackgroundBusyRef.current = false;
    }
  }, [isMixerRunning, menuLinks, isStakingBackgroundBusy]);

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
