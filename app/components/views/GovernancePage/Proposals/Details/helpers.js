import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { StakeyBounceXs, VotingProgress } from "indicators";
import { tsToDate } from "helpers";
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
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noElligibleTickets" m="You don't have tickets elligible for voting on this proposal. Purchase tickets to vote on future proposals." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.purchaseTicketsBtn" m="Purchase Tickets" /></KeyBlueButton>
  </Aux>
);

const CurrentVoteChoiceLabel = ({ currentVoteChoice }) => {
  const className = "proposal-details-current-choice-box " + currentVoteChoice;
  const labels = {
    yes: <T id="proposal.currentChoice.yes" m="Yes" />,
    no: <T id="proposal.currentChoice.no" m="No" />,
    abstain: <T id="proposal.currentChoice.abstain" m="Abstain" />,
    unknown: <T id="proposal.currentChoice.unknown" m="Unknown" />,
  };
  const label = labels[currentVoteChoice] || labels.unknown;

  return (
    <Aux>
      <div className={className} />{label}
    </Aux>
  );
};

export const ChosenVoteOption = ({ currentVoteChoice }) => (
  <Aux>
    <div className="proposal-details-voting-preference-title"><T id="proposalDetails.votingInfo.votingPreferenceTitle" m="My Voting Preference" /></div>
    <div className="proposal-details-current-choice-box"><CurrentVoteChoiceLabel currentVoteChoice={currentVoteChoice} /></div>
  </Aux>
);

export const VotingChoicesInfo = (props) => (
  <Aux>
    <div className="proposal-details-voting-preference-title"><T id="proposalDetails.votingInfo.vote" m="Vote on this proposal" /></div>
    <div className="proposal-details-voting-preference-ticket-count" >
      <T
        id="proposalDetails.votingInfo.eligibleCount"
        m="You have {count, plural, one {one ticket} other {# tickets}} eligible for voting"
        values={{ count: props.eligibleTicketCount }}
      />
    </div>
    <UpdateVoteChoiceModalButton {...props} />
  </Aux>
);

export const UpdatingVoteChoice = () => (
  <Aux>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.updatingVoteChoice" m="Updating vote choice" /></div>
    <StakeyBounceXs />
  </Aux>
);

export const OverviewField = ( { label, value } ) => (
  <div className="proposal-details-overview-field">
    <div className="label">{label}:</div>
    <div className="value">{value}</div>
  </div>
);

export const OverviewVotingProgressInfo = ({ voteCounts }) => (
  <div className="proposal-details-voting-progress">
    <div className="proposal-details-voting-progress-counts">
      <div className="yes-count-box" /><T id="proposal.progressCount.yes" m="{count} Yes" values={{ count: voteCounts.yes }} />
      <div className="no-count-box" /><T id="proposal.progressCount.no" m="{count} No" values={{ count: voteCounts.no }} />
      <div className="abstain-count-box" /><T id="proposal.progressCount.abstain" m="{count} Abstain" values={{ count: voteCounts.abstain }} />
    </div>

    <VotingProgress voteCounts={voteCounts} />
  </div>
);

export const TimeValue = ({ timestamp }) => (
  <Aux>
    <span className="time-value"><FormattedRelative  value={ tsToDate(timestamp) } /></span>
    (<T id="proposal.overview.fullTime" m="{timestamp, date, medium} {timestamp, time, short} UTC" values={{ timestamp: tsToDate(timestamp) }} />)
  </Aux>
);
