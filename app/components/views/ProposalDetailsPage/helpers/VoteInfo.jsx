import { memo } from "react";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_ABANDONED
} from "constants";
import {
  ProposalNotVoting,
  NoTicketsVotingInfo,
  NoElligibleTicketsVotingInfo,
  ProposalAbandoned,
  VotePreference
} from "./";

const VoteInfo = memo(
  ({
    proposalStatus,
    voteStatus,
    hasTickets,
    currentVoteChoice,
    viewedProposalDetails,
    newVoteChoice,
    setVoteOption,
    showPurchaseTicketsPage,
    voteOptions
  }) => {
    const { hasEligibleTickets, eligibleTicketCount } = viewedProposalDetails;
    if (proposalStatus === PROPOSAL_STATUS_ABANDONED) {
      return <ProposalAbandoned />;
    }
    if (voteStatus === PROPOSAL_VOTING_FINISHED) {
      return (
        <VotePreference
          {...{ voteOptions, currentVoteChoice, votingComplete: true }}
        />
      );
    }
    if (voteStatus === PROPOSAL_VOTING_ACTIVE) {
      if (!hasTickets) {
        return <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
      }
      if (!hasEligibleTickets) {
        return (
          <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />
        );
      }
      return (
        <VotePreference
          {...{
            viewedProposalDetails,
            voteOptions,
            setVoteOption,
            newVoteChoice,
            eligibleTicketCount,
            currentVoteChoice,
            votingComplete: false
          }}
        />
      );
    }
    return <ProposalNotVoting />;
  }
);

export default VoteInfo;
