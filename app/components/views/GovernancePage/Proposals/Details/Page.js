import { FormattedMessage as T } from "react-intl";
import { GoBackIconButton } from "buttons";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, VotingChoicesInfo, UpdatingVoteChoice, TimeValue,
  ChosenVoteOption
} from "./helpers";

export default ({ viewedProposalDetails,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice, updateVoteChoiceAttempt }) =>
{
  console.log("viewing", viewedProposalDetails);

  const { name, token, hasEligibleTickets, voting, voteOptions,
    voteCounts, creator, timestamp, voteDetails, currentVoteChoice } = viewedProposalDetails;
  const eligibleTicketCount = viewedProposalDetails.eligibleTickets.length;

  console.log(voteDetails);

  let text = "";
  viewedProposalDetails.files.forEach(f => {
    if (f.mime === "text/plain; charset=utf-8") {
      text += f.payload + "\n\n";
    }
  });

  let voteInfo = null;
  if (updateVoteChoiceAttempt) voteInfo = <UpdatingVoteChoice />;
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
          <div className="proposal-details-token">{token}</div>
          <div className="proposal-details-overview-fields">
            <OverviewField
              label={<T id="proposal.overview.created.label" m="Created by" />}
              value={creator} />
            <OverviewField
              label={<T id="proposal.overview.submitted.label" m="Submitted" />}
              value={<TimeValue timestamp={timestamp} />} />
            <OverviewField
              label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
              value={voting ? <TimeValue timestamp={voteDetails.endTimestamp} /> : null } />
          </div>
        </div>
        <div className="proposal-details-overview-voting">
          <GoBackIconButton />
          {voteInfo}
        </div>
        { voting ? <OverviewVotingProgressInfo {...{ voteCounts }} /> : null }
      </div>
      <div className="proposal-details-text">
        {text}
      </div>
    </Aux>
  );
};
