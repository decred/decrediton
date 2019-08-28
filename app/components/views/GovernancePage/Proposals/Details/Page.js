import { FormattedMessage as T } from "react-intl";
import { GoBackIconButton } from "buttons";
import { PoliteiaLink } from "shared";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, UpdatingVoteChoice, TimeValue,
  ChosenVoteOption, ProposalText, ProposalAbandoned
} from "./helpers";
import {
  VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED, VOTESTATUS_ABANDONED
} from "actions/GovernanceActions";

export default ({ viewedProposalDetails,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice, updateVoteChoiceAttempt, tsDate, text }) =>
{
  const { name, token, hasEligibleTickets, voteStatus, voteOptions,
    voteCounts, creator, timestamp, endTimestamp, currentVoteChoice,
    version } = viewedProposalDetails;
  const eligibleTicketCount = viewedProposalDetails.eligibleTickets.length;

  const isVoting = voteStatus === VOTESTATUS_ACTIVEVOTE;

  let voteInfo = null;
  let votingProgress = null;
  switch (voteStatus) {
    case VOTESTATUS_VOTED:
        voteInfo = <ChosenVoteOption {...{ voteOptions, currentVoteChoice, votingComplete: true }} />;
        votingProgress = <OverviewVotingProgressInfo {...{ voteCounts }} /> ;
    break;
    case VOTESTATUS_ACTIVEVOTE:
      voteInfo = <ProposalNotVoting />;
      votingProgress = <OverviewVotingProgressInfo {...{ voteCounts }} /> 
      break;
    case VOTESTATUS_ABANDONED:
      voteInfo = <ProposalAbandoned />;
      break;
    default:
      voteInfo = <ChosenVoteOption {...{
        voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice,
        eligibleTicketCount, currentVoteChoice, votingComplete: currentVoteChoice !== "abstain",
      }} />;
    break;
  }

  if (updateVoteChoiceAttempt) voteInfo = <UpdatingVoteChoice />;
  else if (!hasTickets) voteInfo = <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
  else if (!hasEligibleTickets) voteInfo = <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;

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
              show={isVoting && endTimestamp}
              label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
              value={isVoting ? <TimeValue timestamp={endTimestamp} tsDate={tsDate} /> : null } />
          </div>
        </div>
        <div className="proposal-details-overview-voting">
          <GoBackIconButton />
          {voteInfo}
        </div>
        { votingProgress }
      </div>
      <div className="proposal-details-text">
        <ProposalText text={text} />
      </div>
    </>
  );
};
