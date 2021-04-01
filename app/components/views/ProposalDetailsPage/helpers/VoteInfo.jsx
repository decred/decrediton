import { memo } from "react";
import {
  VOTESTATUS_ACTIVEVOTE,
  VOTESTATUS_FINISHEDVOTE,
  PROPOSALSTATUS_ABANDONED
} from "actions/GovernanceActions";
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
    if (proposalStatus === PROPOSALSTATUS_ABANDONED) {
      return <ProposalAbandoned />;
    }
    if (voteStatus === VOTESTATUS_FINISHEDVOTE) {
      return (
        <VotePreference
          {...{ voteOptions, currentVoteChoice, votingComplete: true }}
        />
      );
    }
    if (voteStatus === VOTESTATUS_ACTIVEVOTE) {
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
