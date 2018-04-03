import { proposals } from "connectors";
import { GoBackIconButton, KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const LoadingProposal = () => <div><T id="proposalDetails.loading" m="Loading Proposal Details" /></div>;
const ProposalError = ( { error } ) => <div><T id="proposalDetails.loadingError" m="Error loading Proposal: {error}" values={{ error }} /></div>;
const ProposalNotVoting = () =>
  <div className="proposal-details-voting-not-voting"><T id="proposalDetails.votingInfo.notVoting" m="Proposal not yet on voting stage" /></div>;
const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <Aux>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noTickets" m="Voting is only available upon participation in Staking." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking DCR" /></KeyBlueButton>
  </Aux>
);
const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <Aux>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noElligibleTickets" m="You don't have tickets elligible for voting on this proposal." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.purchaseTicketsBtn" m="Purchase Tickets" /></KeyBlueButton>
  </Aux>
);
const VotingChoicesInfo = () => (
  <Aux>
    <div className="proposal-details-voting-preference-title"><T id="proposalDetails.votingInfo.votingPreferenceTitle" m="My Voting Preference" /></div>
  </Aux>
);

const ProposalDetails = ({ viewedProposalDetails, getProposalAttempt, getProposalError,
  showPurchaseTicketsPage, hasTickets }) =>
{

  if (getProposalAttempt) return <LoadingProposal />;
  if (getProposalError) return <ProposalError error={getProposalError} />;

  console.log("viewing", viewedProposalDetails);

  const { name, token, hasElligibleTickets, voting } = viewedProposalDetails;

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
                : <VotingChoicesInfo />
          }
        </div>
      </div>
      <div className="proposal-details-text">
        {text}
      </div>
    </Aux>
  );
};

export default proposals(ProposalDetails);
