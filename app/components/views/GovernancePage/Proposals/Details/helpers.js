import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { StakeyBounceXs, VotingProgress, PoliteiaLoading } from "indicators";
import { showCheck } from "helpers";
import UpdateVoteChoiceModalButton from "./UpdateVoteChoiceModalButton";
import { default as ReactMarkdown }  from "react-markdown";

export const LoadingProposal = () => (
  <div className="proposal-loading-page"><PoliteiaLoading /></div>
);

export const ProposalError = ( { error } ) => <div><T id="proposalDetails.loadingError" m="Error loading Proposal: {error}" values={{ error }} /></div>;

export const ProposalNotVoting = () =>
  <div className="proposal-details-voting-not-voting"><T id="proposalDetails.votingInfo.notVoting" m="Proposal not yet on voting stage" /></div>;

export const ProposalVoted = () =>
  <div className="proposal-details-voting-voted"><T id="proposalDetails.votingInfo.voted" m="Voting has ended for this proposal" /></div>;

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

export const OverviewField = showCheck(( { label, value } ) => (
  <div className="proposal-details-overview-field">
    <div className="label">{label}:</div>
    <div className="value">{value}</div>
  </div>
));

export const OverviewVotingProgressInfo = ({ voteCounts }) => (
  <div className="proposal-details-voting-progress">
    <div className="proposal-details-voting-progress-counts">
      <div className="yes-count-box" />{voteCounts.yes}
      <div className="no-count-box" />{voteCounts.no}
      {/* // TODO: return if we have have quorum/total ticket counts available.
      <div className="abstain-count-box" /><T id="proposal.progressCount.abstain" m="{count} Abstain" values={{ count: voteCounts.abstain }} /> */}
    </div>

    <VotingProgress voteCounts={voteCounts} />
  </div>
);

export const TimeValue = ({ timestamp, tsDate }) => (
  <Aux>
    <span className="time-value"><FormattedRelative  value={ tsDate(timestamp) } /></span>
    (<T id="proposal.overview.fullTime" m="{timestamp, date, medium} {timestamp, time, short}" values={{ timestamp: tsDate(timestamp) }} />)
  </Aux>
);

// This changes links to never open. Debatable whether we want to
// allow proposals to link somewhere directly from decrediton.
const renderInternalProposalLink = ({ children }) => {
  return <a onClick={() => {} } href="#">{children}</a>;
};

const renderProposalImage = ({ alt }) => {
  return <span>{alt}</span>;
};

export const ProposalText = ({ text }) => (
  <ReactMarkdown
    source={text}

    // NEVER set to false
    escapeHtml={true}

    // debatable whether we wanna allow the embedded html sections to be
    // shown. Theoretically, escapeHtml=true should suffice, but playing it
    // safe for the moment and also setting this as true.
    skipHtml={true}

    renderers={{
      link: renderInternalProposalLink,
      linkReference: renderInternalProposalLink,

      // debatable whether we wanna allow inline image references in proposals
      // in decrediton.
      imageReference: () => renderProposalImage,
      image: () => renderProposalImage,

      html: () => null,
    }}
  />
);
