import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";
import { usePrevious } from "helpers";

export function useProposalsList(tab) {
  const [noMoreProposals, setNoMore] = useState(false);
  const proposals = useSelector(sel.proposals);
  const inventory = useSelector(sel.inventory);
  const dispatch = useDispatch();
  const getProposalsAndUpdateVoteStatus = (proposalBatch) =>
    dispatch(gov.getProposalsAndUpdateVoteStatus(proposalBatch));
  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!proposals || !proposals[tab] || !inventory || !inventory[tab])
          return send("FETCH");
        if (inventory[tab].length === 0) return;
        if (proposals[tab].length === 0) {
          return send("FETCH");
        }
        if (proposals[tab].length === inventory[tab].length) {
          setNoMore(true);
          return send("RESOLVE");
        }
        send("RESOLVE");
      },
      load: () => {
        if (!proposals || !proposals[tab] || !inventory || !inventory[tab])
          return;
        if (proposals[tab].length >= inventory[tab].length) {
          setNoMore(true);
          return send("RESOLVE");
        }
        onLoadMoreProposals(
          proposals[tab],
          inventory[tab],
          getProposalsAndUpdateVoteStatus
        ).then((res) => {
          send({ type: "RESOLVE", data: res });
        });
      }
    }
  });
  const previous = usePrevious({ proposals, tab });
  useEffect(() => {
    if (!previous || !previous.proposals || !previous.proposals[tab]) return;
    if (previous.tab !== tab) return;
    // if proposals list is bigger goes to success. This is needed because
    // if enabling politeia decrediton gets the inventory and initial batch
    // in the same request.
    if (proposals[tab].length > previous.proposals[tab].length) {
      send("RESOLVE");
    }
  }, [proposals, previous, send, tab]);

  return { noMoreProposals, state, proposals };
}

async function onLoadMoreProposals(
  proposals,
  inventory,
  getProposalsAndUpdateVoteStatus,
  proposallistpagesize = 20 // TODO: Get proposallistpagesize from politeia's request: /v1/policy
) {
  const proposalLength = proposals.length;
  let proposalNumber;
  if (inventory.length <= proposallistpagesize) {
    proposalNumber = inventory.length;
  } else {
    proposalNumber = proposallistpagesize + proposalLength;
  }

  const proposalBatch = inventory.slice(proposalLength, proposalNumber);
  try {
    await getProposalsAndUpdateVoteStatus(proposalBatch);
  } catch (err) {
    console.log(err);
  }
}
