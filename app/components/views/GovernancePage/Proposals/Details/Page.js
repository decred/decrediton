import { GoBackIconButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, VotingChoicesInfo, UpdatingVoteChoice, TimeValue,
} from "./helpers";

export default ({ viewedProposalDetails,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice, updateVoteChoiceAttempt }) =>
{
  console.log("viewing", viewedProposalDetails);

  const { name, token, hasElligibleTickets, voting, voteOptions,
    voteCounts, creator, timestamp, voteDetails, currentVoteChoice } = viewedProposalDetails;

  console.log(voteDetails);

  let text = "";
  viewedProposalDetails.files.forEach(f => {
    if (f.mime === "text/plain; charset=utf-8") {
      text += f.payload + "\n\n";
    }
  });

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
          { updateVoteChoiceAttempt
            ? <UpdatingVoteChoice />
            : !voting
              ? <ProposalNotVoting />
              : !hasTickets
                ? <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />
                : !hasElligibleTickets
                  ? <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />
                  : <VotingChoicesInfo {...{ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice, currentVoteChoice }}  />
          }
        </div>
        { voting ? <OverviewVotingProgressInfo {...{ voteCounts }} /> : null }
      </div>
      <div className="proposal-details-text">
        {text}
      </div>
    </Aux>
  );
};
