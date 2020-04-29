import React from "react";
import ChooseVoteOption from "./ChooseVoteOption.jsx";
import {
  VOTESTATUS_ACTIVEVOTE,
  VOTESTATUS_FINISHEDVOTE,
  PROPOSALSTATUS_ABANDONED
} from "actions/GovernanceActions";
import {
  ProposalNotVoting,
  NoTicketsVotingInfo,
  NoElligibleTicketsVotingInfo,
  ProposalAbandoned
} from "./";

const VoteInfo = React.memo(
  ({
    proposalStatus,
    voteStatus,
    hasTickets,
    hasEligibleTickets,
    currentVoteChoice,
    viewedProposalDetails,
    eligibleTicketCount,
    newVoteChoice,
    setVoteOption,
    showPurchaseTicketsPage,
    voteOptions
  }) => {
    if (proposalStatus === PROPOSALSTATUS_ABANDONED) {
      return <ProposalAbandoned />;
    }
    if (voteStatus === VOTESTATUS_FINISHEDVOTE) {
      return (
        <ChooseVoteOption
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
        <ChooseVoteOption
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
