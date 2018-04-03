import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import UpdateVoteChoiceModalButton from "./UpdateVoteChoiceModalButton";

export const LoadingProposal = () => <div><T id="proposalDetails.loading" m="Loading Proposal Details" /></div>;

export const ProposalError = ( { error } ) => <div><T id="proposalDetails.loadingError" m="Error loading Proposal: {error}" values={{ error }} /></div>;

export const ProposalNotVoting = () =>
  <div className="proposal-details-voting-not-voting"><T id="proposalDetails.votingInfo.notVoting" m="Proposal not yet on voting stage" /></div>;

export const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <Aux>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noTickets" m="Voting is only available upon participation in Staking." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking DCR" /></KeyBlueButton>
  </Aux>
);

export const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <Aux>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noElligibleTickets" m="You don't have tickets elligible for voting on this proposal." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.purchaseTicketsBtn" m="Purchase Tickets" /></KeyBlueButton>
  </Aux>
);

export const VotingChoicesInfo = (props) => (
  <Aux>
    <div className="proposal-details-voting-preference-title"><T id="proposalDetails.votingInfo.votingPreferenceTitle" m="My Voting Preference" /></div>
    <UpdateVoteChoiceModalButton {...props} />
  </Aux>
);
