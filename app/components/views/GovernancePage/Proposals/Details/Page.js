import { FormattedMessage as T } from "react-intl";
import { GoBackIconButton } from "buttons";
import { PoliteiaLink } from "shared";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, VotingChoicesInfo, UpdatingVoteChoice, TimeValue,
  ChosenVoteOption, ProposalText, ProposalVoted,
} from "./helpers";
import { politeiaMarkdownIndexMd } from "helpers";
import {
  VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED
} from "actions/GovernanceActions";

export default ({ viewedProposalDetails,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice, updateVoteChoiceAttempt, tsDate }) =>
{
  const { name, token, hasEligibleTickets, voteStatus, voteOptions,
    voteCounts, creator, timestamp, voteDetails, currentVoteChoice } = viewedProposalDetails;
  const eligibleTicketCount = viewedProposalDetails.eligibleTickets.length;

  let text = "";
  viewedProposalDetails.files.forEach(f => {
    if (f.name === "index.md") {
      text = politeiaMarkdownIndexMd(f.payload);
    }
  });

  const voted = voteStatus === VOTESTATUS_VOTED;
  const voting = voteStatus === VOTESTATUS_ACTIVEVOTE;

  let voteInfo = null;
  if (updateVoteChoiceAttempt) voteInfo = <UpdatingVoteChoice />;
  else if (voted) voteInfo = <ProposalVoted />;
  else if (!voting) voteInfo = <ProposalNotVoting />;
  else if (!hasTickets) voteInfo = <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
  else if (!hasEligibleTickets) voteInfo = <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
  else if (currentVoteChoice !== "abstain") voteInfo = <ChosenVoteOption {...{ currentVoteChoice }} />;
  else {
    voteInfo = <VotingChoicesInfo {...{ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice, eligibleTicketCount }}  />;
  }

  return (
    <Aux>
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
              label={<T id="proposal.overview.submitted.label" m="Submitted" />}
              value={<TimeValue timestamp={timestamp} tsDate={tsDate} />} />
            <OverviewField
              show={voting && voteDetails && voteDetails.endTimestamp}
              label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
              value={voting ? <TimeValue timestamp={voteDetails.endTimestamp} tsDate={tsDate} /> : null } />
          </div>
        </div>
        <div className="proposal-details-overview-voting">
          <GoBackIconButton />
          {voteInfo}
        </div>
        { voting || voted ? <OverviewVotingProgressInfo {...{ voteCounts }} /> : null }
      </div>
      <div className="proposal-details-text">
        <ProposalText text={text} />
      </div>
    </Aux>
  );
};
