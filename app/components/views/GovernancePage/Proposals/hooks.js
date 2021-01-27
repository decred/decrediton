import { useState, useEffect, useReducer, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";
import { usePrevious } from "hooks";
import { setLastPoliteiaAccessTime } from "actions/WalletLoaderActions";

const MAX_PAGE_SIZE = 20; // TODO: Get proposallistpagesize from politeia's request: /v1/policy

export function useProposalsTab() {
  // TODO: move reducers which only control local states from reducer/governance.js to here.
  const activeVoteCount = useSelector(sel.newActiveVoteProposalsCount);
  const preVoteCount = useSelector(sel.newPreVoteProposalsCount);
  const politeiaEnabled = useSelector(sel.politeiaEnabled);
  const compareInventory = () => dispatch(gov.compareInventory());
  const location = useSelector(sel.location);
  const isTestnet = useSelector(sel.isTestNet);
  const dispatch = useDispatch();
  const [tab, setTab] = useReducer(() => getProposalsTab(location));

  useEffect(() => {
    return () => dispatch(setLastPoliteiaAccessTime());
  }, [dispatch]);
  const getTokenAndInitialBatch = () => dispatch(gov.getTokenAndInitialBatch());
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
    compareInventory
  };
}

export function useProposalsListItem(token) {
  const tsDate = useSelector((state) => sel.tsDate(state));
  const dispatch = useDispatch();
  const viewProposalDetailsHandler = () =>
    dispatch(gov.viewProposalDetails(token));
  return { tsDate, viewProposalDetailsHandler };
}

export function useProposalsList(tab) {
  const [noMoreProposals, setNoMore] = useState(false);
  const proposals = useSelector(sel.proposals);
  const inventory = useSelector(sel.inventory);
  const getProposalError = useSelector(sel.getProposalError);
  const inventoryError = useSelector(sel.getTokenInventoryError);
  const dispatch = useDispatch();
  const getProposalsAndUpdateVoteStatus = (proposalBatch) =>
    dispatch(gov.getProposalsAndUpdateVoteStatus(proposalBatch));
  const getTokenAndInitialBatch = () => dispatch(gov.getTokenAndInitialBatch());
  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!proposals || !proposals[tab] || !inventory || !inventory[tab])
          return send("FETCH");
        if (inventory[tab].length === 0) return;
        if (
          proposals[tab].length === 0 ||
          proposals[tab].length < inventory[tab].length
        ) {
          return send("FETCH");
        }
        if (proposals[tab].length === inventory[tab].length) {
          setNoMore(true);
          return send("RESOLVE");
        }
        send("RESOLVE");
      },
      load: () => {
        if (inventoryError || !inventory || !inventory[tab]) {
          // force loading for 500ms
          setTimeout(() => {
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
        if (!proposals || !proposals[tab] || !inventory || !inventory[tab])
          return;
        if (
          !getProposalError &&
          proposals[tab].length >= inventory[tab].length
        ) {
          setNoMore(true);
          return send("RESOLVE");
        }
        onLoadMoreProposals(
          proposals[tab],
          inventory[tab],
          getProposalsAndUpdateVoteStatus
        )
          .then((res) => {
            send({ type: "RESOLVE", data: res });
          })
          .catch(() => send("REJECT"));
      }
    }
  });

  const previous = usePrevious({ proposals, tab, getProposalError });

  useEffect(() => {
    if (inventoryError) {
      send("REJECT");
      setNoMore(true);
      return;
    }
    if (!previous || !previous.proposals || !previous.proposals[tab]) return;
    if (previous.tab !== tab) {
      send("FETCH");
      return;
    }
    if (previous.getProposalError != getProposalError) {
      send(getProposalError ? "REJECT" : "RETRY");
      return;
    }
  }, [proposals, previous, send, tab, getProposalError, inventoryError]);

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
  proposals,
  inventory,
  getProposalsAndUpdateVoteStatus,
  proposallistpagesize = MAX_PAGE_SIZE // TODO: Get proposallistpagesize from politeia's request: /v1/policy
) => {
  const proposalLength = proposals.length;
  let proposalNumber;
  if (inventory.length <= proposallistpagesize) {
    proposalNumber = inventory.length;
  } else {
    proposalNumber = proposallistpagesize + proposalLength;
  }

  const proposalBatch = inventory.slice(proposalLength, proposalNumber);
  return await getProposalsAndUpdateVoteStatus(proposalBatch);
};

const getProposalsTab = (location) => {
  const { pathname } = location;
  if (pathname.includes("prevote")) {
    return "preVote";
  }
  if (pathname.includes("activevote")) {
    return "activeVote";
  }
  if (pathname.includes("voted")) {
    return "finishedVote";
  }
  if (pathname.includes("abandoned")) {
    return "abandonedVote";
  }
};
