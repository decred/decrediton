import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
import { PoliteiaLink } from "shared";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, UpdatingVoteChoice, TimeValue,
  ChosenVoteOption, ProposalText, ProposalAbandoned
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
  const eligibleTicketCount = viewedProposalDetails.eligibleTicketCount;
  const voted = voteStatus === VOTESTATUS_FINISHEDVOTE;
  const voting = voteStatus === VOTESTATUS_ACTIVEVOTE;
  let voteInfo = null;

  switch(voteStatus) {
  case VOTESTATUS_ACTIVEVOTE:
    if (updateVoteChoiceAttempt) voteInfo = <UpdatingVoteChoice />;
    else if (!hasTickets) voteInfo = <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
    else if (!hasEligibleTickets) voteInfo = <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
    else {
      voteInfo =
        <ChosenVoteOption
          {...{ voteOptions, onUpdateVoteChoice,
            onVoteOptionSelected, newVoteChoice, eligibleTicketCount,
            currentVoteChoice, votingComplete: false }}
        />;
    }
    break;
  case VOTESTATUS_FINISHEDVOTE:
    voteInfo = <ChosenVoteOption {...{ voteOptions, currentVoteChoice, votingComplete: true }} />;
    break;
  default:
    if (proposalStatus === PROPOSALSTATUS_ABANDONED) voteInfo = <ProposalAbandoned />;
    else voteInfo = <ProposalNotVoting />;
    break;
  }

  return (
    <>
      <div className="proposal-details-overview">
        <div className="proposal-details-overview-info">
          <div className="proposal-details-title">{name}</div>
          <div className="proposal-details-token">
            <PoliteiaLink path={"/proposals/"+token}>{token}</PoliteiaLink>
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
              show={voting && endTimestamp}
              label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
              value={voting ? <TimeValue timestamp={endTimestamp} tsDate={tsDate} /> : null } />
          </div>
        </div>
        <div className="proposal-details-overview-voting">
          <InvisibleButton className="go-back-icon-button" onClick={goBackHistory} />
          {voteInfo}
        </div>
        {(voting || voted )  &&
          <OverviewVotingProgressInfo {...{ voteCounts, quorumMinimumVotes }} /> }
      </div>
      <div className="proposal-details-text">
        <div className="links">
          <PoliteiaLink path={"/proposals/"+token}>
            <T id="proposals.community.goToProposal" m="See proposal comments on Politeia" />
          </PoliteiaLink>
        </div>
        <ProposalText text={text} />
      </div>
    </>
  );
};
