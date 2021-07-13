import { memo } from "react";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED,
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
    showPurchaseTicketsPage,
    voteOptions
  }) => {
    const { hasEligibleTickets, eligibleTicketCount } = viewedProposalDetails;
    if (proposalStatus === PROPOSAL_STATUS_ABANDONED) {
      return <ProposalAbandoned />;
    }
    if (
      voteStatus === PROPOSAL_VOTING_FINISHED ||
      voteStatus === PROPOSAL_VOTING_REJECTED ||
      voteStatus === PROPOSAL_VOTING_APPROVED
    ) {
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
