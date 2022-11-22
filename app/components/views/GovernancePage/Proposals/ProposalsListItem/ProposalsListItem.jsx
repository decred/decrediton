import { PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED } from "constants";
import { classNames } from "pi-ui";
import { useProposalsListItem } from "../hooks";
import styles from "./ProposalsListItem.module.css";
import ProposalCard from "../../../ProposalDetailsPage/helpers/ProposalCard";
import CardWrapper from "./CardWrapper";

const ProposalsListItem = ({
  name,
  timestamp,
  token,
  voteCounts,
  voteStatus,
  voteResult,
  modifiedSinceLastAccess,
  votingSinceLastAccess,
  quorumMinimumVotes,
  finishedVote,
  linkto,
  approved,
  totalVotes,
  endTimestamp,
  blocksLeft,
  username,
  proposalStatus,
  version,
  isDarkTheme
}) => {
  const { viewProposalDetailsHandler, tsDate, isTestnet, linkedProposal } =
    useProposalsListItem(token);
  const isVoting = voteStatus === PROPOSAL_VOTING_ACTIVE;
  const isModified =
    (!isVoting && modifiedSinceLastAccess) ||
    (isVoting && votingSinceLastAccess);

  const shortToken = token.substring(0, 7);
  const shortRFPToken = linkedProposal?.token.substring(0, 7);
  const proposalPath = `/record/${shortToken}`;
  const isVoteActive = voteStatus === PROPOSAL_VOTING_ACTIVE;
  const isVoteActiveOrFinished =
    isVoteActive || voteStatus === PROPOSAL_VOTING_FINISHED;

  return (
    <CardWrapper
      onClick={viewProposalDetailsHandler}
      className={classNames(
        styles[voteResult],
        !approved && styles.declined,
        finishedVote && styles.ended,
        isModified && styles.modified
      )}>
      <ProposalCard
        {...{
          isTestnet,
          token,
          linkto,
          approved,
          totalVotes,
          endTimestamp,
          blocksLeft,
          name,
          username,
          timestamp,
          tsDate,
          version,
          proposalStatus,
          voteStatus,
          isDarkTheme,
          linkedProposal,
          quorumMinimumVotes,
          voteCounts,
          shortToken,
          shortRFPToken,
          proposalPath,
          isVoteActive,
          isVoteActiveOrFinished,
          isCardClickable: true,
          className: styles.overview
        }}
      />
    </CardWrapper>
  );
};

export default ProposalsListItem;
