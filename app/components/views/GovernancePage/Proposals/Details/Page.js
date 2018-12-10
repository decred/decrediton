import { FormattedMessage as T } from "react-intl";
import { GoBackIconButton } from "buttons";
import { PoliteiaLink } from "shared";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, UpdatingVoteChoice, TimeValue,
  ChosenVoteOption, ProposalText, ProposalAbandoned
} from "./helpers";
import { politeiaMarkdownIndexMd } from "helpers";
import {
  VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED, VOTESTATUS_ABANDONED
} from "actions/GovernanceActions";

export default ({ viewedProposalDetails,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice, updateVoteChoiceAttempt, tsDate }) =>
{
  const { name, token, hasEligibleTickets, voteStatus, voteOptions,
    voteCounts, creator, timestamp, endTimestamp, currentVoteChoice,
    version } = viewedProposalDetails;
  const eligibleTicketCount = viewedProposalDetails.eligibleTickets.length;

  let text = "";
  viewedProposalDetails.files.forEach(f => {
    if (f.name === "index.md") {
      text = politeiaMarkdownIndexMd(f.payload);
    }
  });

  const voted = voteStatus === VOTESTATUS_VOTED;
  const voting = voteStatus === VOTESTATUS_ACTIVEVOTE;
  const abandoned = voteStatus === VOTESTATUS_ABANDONED;


  let voteInfo = null;
  if (updateVoteChoiceAttempt) voteInfo = <UpdatingVoteChoice />;
  else if (abandoned) voteInfo = <ProposalAbandoned />;
  else if (voted) voteInfo = <ChosenVoteOption {...{ voteOptions, currentVoteChoice, votingComplete: true }} />;
  else if (!voting) voteInfo = <ProposalNotVoting />;
  else if (!hasTickets) voteInfo = <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
  else if (!hasEligibleTickets) voteInfo = <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
  else voteInfo = <ChosenVoteOption {...{ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice, eligibleTicketCount, currentVoteChoice, votingComplete: currentVoteChoice !== "abstain" }} />;

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
