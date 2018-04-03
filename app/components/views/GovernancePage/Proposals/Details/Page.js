import { GoBackIconButton } from "buttons";
import {
  ProposalNotVoting, NoTicketsVotingInfo,
  NoElligibleTicketsVotingInfo, VotingChoicesInfo
} from "./helpers";

export default ({ viewedProposalDetails,
  showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
  newVoteChoice }) =>
{
  console.log("viewing", viewedProposalDetails);

  const { name, token, hasElligibleTickets, voting, voteOptions } = viewedProposalDetails;

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
        </div>
        <div className="proposal-details-overview-voting">
          <GoBackIconButton />
          { !voting
            ? <ProposalNotVoting />
            : !hasTickets
              ? <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />
              : !hasElligibleTickets
                ? <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />
                : <VotingChoicesInfo {...{ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice }}  />
          }
        </div>
      </div>
      <div className="proposal-details-text">
        {text}
      </div>
    </Aux>
  );
};
