import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
import { PoliteiaLink } from "shared";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, UpdatingVoteChoice, TimeValue,
  ChooseVoteOption, ProposalText, ProposalAbandoned
} from "./helpers";
import {
  VOTESTATUS_ACTIVEVOTE, VOTESTATUS_FINISHEDVOTE, PROPOSALSTATUS_ABANDONED
} from "actions/GovernanceActions";

export default ({ viewedProposalDetails, goBackHistory,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice, updateVoteChoiceAttempt, tsDate, text }) =>
{
  const { name, token, voteStatus, proposalStatus, voteOptions, voteCounts,
    creator, timestamp, endTimestamp, currentVoteChoice, hasEligibleTickets,
    version, quorumMinimumVotes } = viewedProposalDetails;
  const getVoteInfo = ({
    voteStatus, voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice,
    eligibleTicketCount,currentVoteChoice, showPurchaseTicketsPage
  }) => {
    if (voteStatus === VOTESTATUS_FINISHEDVOTE) {
      return <ChooseVoteOption {...{ voteOptions, currentVoteChoice, votingComplete: true }} />;
    }
    if (voteStatus === VOTESTATUS_ACTIVEVOTE) {
      if (updateVoteChoiceAttempt) {
        return <UpdatingVoteChoice />;
      }
      if (!hasTickets) {
        return <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
      }
      if (!hasEligibleTickets) {
        return <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
      }

      return <ChooseVoteOption {...{ voteOptions, onUpdateVoteChoice,
        onVoteOptionSelected, newVoteChoice, eligibleTicketCount,
        currentVoteChoice, votingComplete: false }} />;
    }
    return <ProposalNotVoting />;
  };

  const eligibleTicketCount = viewedProposalDetails.walletEligibleTickets && viewedProposalDetails.walletEligibleTickets.length;
  let voteInfo = null;

  // Check if proposal is abandoned. If it is not we check its vote status
  if (proposalStatus === PROPOSALSTATUS_ABANDONED) {
    voteInfo = <ProposalAbandoned />;
  } else {
    voteInfo = getVoteInfo({
      voteStatus, voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice,
      eligibleTicketCount,currentVoteChoice, showPurchaseTicketsPage
    });
  }

  return (
    <>
      <div className="proposal-details-overview">
        <div className="proposal-details-overview-info">
          <div className="proposal-details-title">{name}</div>
          <div className="proposal-details-token">
            <PoliteiaLink path={"/proposal/"+token}>{token}</PoliteiaLink>
          </div>
          <div className="proposal-details-overview-fields">
            <OverviewField
              label={<T id="proposal.overview.created.label" m="Created by" />}
              value={creator} />
            <OverviewField
              label={<T id="proposal.overview.version.label" m="Version" />}
              value={version} />
            <OverviewField
              label={<T id="proposal.overview.lastUpdated.label" m="Last Updated" />}
              value={<TimeValue timestamp={timestamp} tsDate={tsDate} />} />
            <OverviewField
              show={voteStatus === VOTESTATUS_ACTIVEVOTE && endTimestamp}
              label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
              value={<TimeValue timestamp={endTimestamp} tsDate={tsDate} /> } />
          </div>
        </div>
        <div className="proposal-details-overview-voting">
          <InvisibleButton className="go-back-icon-button" onClick={goBackHistory} />
          {voteInfo}
        </div>
        {(voteStatus === VOTESTATUS_ACTIVEVOTE || voteStatus === VOTESTATUS_FINISHEDVOTE ) &&
          <OverviewVotingProgressInfo {...{ voteCounts, quorumMinimumVotes }} /> }
      </div>
      <div className="proposal-details-text">
        <div className="links">
          <PoliteiaLink path={"/proposal/"+token}>
            <T id="proposals.community.goToProposal" m="See proposal comments on Politeia" />
          </PoliteiaLink>
        </div>
        <ProposalText text={text} />
      </div>
    </>
  );
};
