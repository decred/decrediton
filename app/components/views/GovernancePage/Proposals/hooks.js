import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";
import { usePrevious } from "hooks";
import { setLastPoliteiaAccessTime } from "actions/WalletLoaderActions";
import { useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { PROPOSALS_MAX_PAGE_SIZE, INVENTORY_MAX_PAGE_SIZE } from "constants";
import { mapTabsToStatus, mapStatusLabelToValue } from "./helpers";
import { difference } from "fp";

export function useProposalsTab() {
  // TODO: move reducers which only control local states from reducer/governance.js to here.
  const activeVoteCount = useSelector(sel.newActiveVoteProposalsCount);
  const preVoteCount = useSelector(sel.newPreVoteProposalsCount);
  const politeiaEnabled = useSelector(sel.politeiaEnabled);
  const location = useSelector(sel.location);
  const [tab, setTab] = useReducer(() => getProposalsTab(location));
  const isTestnet = useSelector(sel.isTestNet);
  const dispatch = useDispatch();
  const getTokenAndInitialBatch = () => dispatch(gov.getTokenAndInitialBatch());
  const resetInventoryAndProposals = () =>
    dispatch(gov.resetInventoryAndProposals());

  useEffect(() => {
    return () => dispatch(setLastPoliteiaAccessTime());
  }, [dispatch]);

  useEffect(() => {
    const tab = getProposalsTab(location);
    setTab(tab);
  }, [location]);

  return {
    activeVoteCount,
    getTokenAndInitialBatch,
    isTestnet,
    preVoteCount,
    politeiaEnabled,
    tab,
    window,
    resetInventoryAndProposals,
    tabStatuses: mapTabsToStatus[tab]
  };
}

export function useProposalsListItem(token) {
  const tsDate = useSelector((state) => sel.tsDate(state));
  const isTestnet = useSelector(sel.isTestNet);
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  const proposals = useSelector(sel.proposals);
  const proposalsDetails = useSelector(sel.proposalsDetails);
  const viewedProposalDetails = useMemo(() => proposalsDetails[token], [
    token,
    proposalsDetails
  ]);

  const linkedProposal = useMemo(
    () =>
      viewedProposalDetails?.linkto &&
      proposals.finishedVote.find(
        (proposal) => viewedProposalDetails.linkto === proposal.token
      ),
    [proposals, viewedProposalDetails]
  );

  const dispatch = useDispatch();
  const viewProposalDetailsHandler = () =>
    dispatch(gov.viewProposalDetails(token));
  return {
    tsDate,
    viewProposalDetailsHandler,
    isTestnet,
    isDarkTheme,
    linkedProposal
  };
}

export function useProposalsList(tab) {
  const [noMoreProposals, setNoMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusIndex, setStatusIndex] = useState(0);
  const currentStatus = useMemo(() => mapTabsToStatus[tab][statusIndex], [
    tab,
    statusIndex
  ]);

  const proposals = useSelector(sel.proposals);
  const inventory = useSelector(sel.inventory);
  const getProposalError = useSelector(sel.getProposalError);
  const inventoryError = useSelector(sel.getVotesInventoryError);
  const dispatch = useDispatch();
  const getProposalsAndUpdateVoteStatus = (proposalBatch) =>
    dispatch(gov.getProposalsAndUpdateVoteStatus(proposalBatch));
  const getTokenAndInitialBatch = () => dispatch(gov.getTokenAndInitialBatch());
  const getVotesInventory = (status, page) =>
    dispatch(gov.getVotesInventory(status, page));

  const noInventoryFetched =
    inventoryError || !inventory || !inventory[currentStatus];
  const tokens = (inventory && inventory[currentStatus]) || [];
  const proposalsFromStatus = proposals[currentStatus];
  const needsAnotherInventoryPage =
    proposalsFromStatus.length === tokens.length &&
    tokens.length > 0 &&
    tokens.length % INVENTORY_MAX_PAGE_SIZE === 0;
  const hasAnotherStatus = statusIndex < mapTabsToStatus[tab].length - 1;
  const statusValue = mapStatusLabelToValue[currentStatus];
  const unfetchedTokens = difference(tokens)(
    proposalsFromStatus.map(({ token }) => token)
  );

  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (
          !proposals ||
          !proposalsFromStatus ||
          !inventory ||
          !inventory[currentStatus]
        )
          return send("FETCH");
        if (proposalsFromStatus.length === 0 || unfetchedTokens.length > 0) {
          return send("FETCH");
        }
        if (!needsAnotherInventoryPage && !hasAnotherStatus) {
          setNoMore(true);
          return send("RESOLVE");
        }
        if (hasAnotherStatus) {
          setStatusIndex(statusIndex + 1);
          return send("FETCH");
        }
        if (tokens.length === 0) return;
        send("RESOLVE");
      },
      load: () => {
        if (noInventoryFetched) {
          // force loading for 500ms
          return setTimeout(() => {
            getTokenAndInitialBatch()
              .then((res) => {
                return send({ type: "RESOLVE", data: res });
              })
              .catch(() => {
                setNoMore(true);
                return send("REJECT");
              });
          }, 500);
        }
        if (!proposals || !proposalsFromStatus) return;
        if (!getProposalError && !unfetchedTokens.length) {
          if (needsAnotherInventoryPage) {
            getVotesInventory(statusValue, currentPage + 1).then(() => {
              setCurrentPage(currentPage + 1);
              return send("FETCH");
            });
            return;
          } else if (!hasAnotherStatus) {
            setNoMore(true);
            return send("RESOLVE");
          } else if (!tokens.length) {
            setStatusIndex(statusIndex + 1);
            return send("RESOLVE");
          }
        }
        onLoadMoreProposals(unfetchedTokens, getProposalsAndUpdateVoteStatus)
          .then((res) => {
            send({ type: "RESOLVE", data: res });
          })
          .catch(() => send("REJECT"));
      }
    }
  });

  const previous = usePrevious({
    proposalsFromStatus,
    tab,
    getProposalError,
    inventory,
    tokens
  });

  useEffect(() => {
    if (inventoryError) {
      send("REJECT");
      setNoMore(true);
      return;
    }
    if (noInventoryFetched) {
      setCurrentPage(1);
      setStatusIndex(0);
      send("RESET");
      return;
    }
    if (
      !previous ||
      !previous.proposalsFromStatus ||
      !previous.proposalsFromStatus
    )
      return;
    if (previous.tab !== tab) {
      send("FETCH");
      setCurrentPage(1);
      setStatusIndex(0);
      return;
    }
    if (hasAnotherStatus && !unfetchedTokens.length) {
      setStatusIndex(statusIndex + 1);
    }
    if (previous.getProposalError != getProposalError) {
      send(getProposalError ? "REJECT" : "RETRY");
      return;
    }
  }, [
    previous,
    send,
    tab,
    getProposalError,
    inventoryError,
    hasAnotherStatus,
    statusIndex,
    noInventoryFetched,
    unfetchedTokens
  ]);

  const loadMore = useCallback(() => send("FETCH"), [send]);

  return {
    noMoreProposals,
    state,
    proposals,
    loadMore,
    getProposalError,
    inventoryError,
    send
  };
}

const onLoadMoreProposals = async (
  inventory,
  getProposalsAndUpdateVoteStatus,
  proposallistpagesize = PROPOSALS_MAX_PAGE_SIZE
) => {
  const batchTokens = inventory.slice(0, proposallistpagesize);
  return await getProposalsAndUpdateVoteStatus(batchTokens);
};

const getProposalsTab = (location) => {
  const { pathname } = location;
  if (pathname.includes("review")) {
    return "underReview";
  }
  if (pathname.includes("voted")) {
    return "finishedVote";
  }
  if (pathname.includes("abandoned")) {
    return "abandonedVote";
  }
};
