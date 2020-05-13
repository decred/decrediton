import { FormattedMessage as T } from "react-intl";
import { VotingProgress } from "indicators";
import { PoliteiaLoading, NoProposals } from "indicators";
import {
  VOTESTATUS_ACTIVEVOTE,
  VOTESTATUS_FINISHEDVOTE
} from "actions/GovernanceActions";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedRelative } from "shared";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";
import { usePrevious } from "helpers";
import styles from "./ProposalsList.module.css";

function ProposalListItem({
  name,
  timestamp,
  token,
  voteCounts,
  voteStatus,
  currentVoteChoice,
  quorumPass,
  voteResult,
  modifiedSinceLastAccess,
  votingSinceLastAccess,
  quorumMinimumVotes
}) {
  const tsDate = useSelector((state) => sel.tsDate(state));
  const dispatch = useDispatch();
  const isVoting = voteStatus == VOTESTATUS_ACTIVEVOTE;
  const modifiedClassName =
    (!isVoting && modifiedSinceLastAccess) ||
    (isVoting && votingSinceLastAccess)
      ? "proposal-modified-since-last-access"
      : null;

  return (
    <div
      onClick={() => dispatch(gov.viewProposalDetails(token))}
      className={[
        "is-row",
        "proposal-list-item",
        voteResult,
        modifiedClassName
      ].join(" ")}>
      <div className="info">
        <div className="proposal-name">{name}</div>
        <div className="proposal-token">{token}</div>
      </div>
      <div className="proposal-results-area">
        {(voteStatus === VOTESTATUS_ACTIVEVOTE ||
          voteStatus === VOTESTATUS_FINISHEDVOTE) && (
          <div className="is-row voting-indicator">
            <div
              className={
                "vote-choice " + (currentVoteChoice && currentVoteChoice.id)
              }
            />
            <VotingProgress {...{ voteCounts, quorumMinimumVotes }} />
          </div>
        )}
        {voteStatus !== VOTESTATUS_FINISHEDVOTE ? (
          <div className="proposal-timestamp">
            <T
              id="proposalItem.lastUpdatedAt"
              m="Last Updated {reldate}"
              values={{
                reldate: <FormattedRelative value={tsDate(timestamp)} />
              }}
            />
          </div>
        ) : (
          <div className="vote-result">
            {quorumPass ? (
              voteResult
            ) : (
              <T id="proposals.quorumNotMet" m="Quorum not met" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// TODO: Get proposallistpagesize from politeia's request: /v1/policy
async function onLoadMoreProposals(
  proposals,
  inventory,
  getProposalsAndUpdateVoteStatus,
  proposallistpagesize = 20
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

export function ProposalList({ finishedVote, tab }) {
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

  switch (state.value) {
    case "idle":
      return <NoProposals />;
    case "loading":
      return (
        <div className={styles.loadingPage}>
          <PoliteiaLoading center />
        </div>
      );
    case "success":
      return proposals[tab] && proposals[tab].length ? (
        <InfiniteScroll
          hasMore={!noMoreProposals}
          loadMore={() => send("FETCH")}
          initialLoad={false}
          useWindow={false}
          threshold={300}>
          <div className={"proposal-list " + (finishedVote && "ended")}>
            {proposals[tab].map((v) => (
              <ProposalListItem key={v.token} {...v} />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <NoProposals />
      );
    default:
      return null;
  }
}
