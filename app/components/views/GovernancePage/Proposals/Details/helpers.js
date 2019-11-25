import { shell } from "electron";
import { KeyBlueButton, InvisibleConfirmModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { StakeyBounceXs, VotingProgress, PoliteiaLoading } from "indicators";
import { showCheck } from "helpers";
import UpdateVoteChoiceModalButton from "./UpdateVoteChoiceModalButton";
import { default as ReactMarkdown }  from "react-markdown";
import { FormattedRelative } from "shared";

export const LoadingProposal = () =>
  <div className="proposal-loading-page"><PoliteiaLoading /></div>;

export const ProposalError = ( { error } ) => <div><T id="proposalDetails.loadingError" m="Error loading Proposal: {error}" values={{ error }} /></div>;

export const ProposalAbandoned = () =>
  <div className="proposal-details-voting-not-voting"><T id="proposalDetails.votingInfo.abandoned" m="Proposal has been abandoned" /></div>;

export const ProposalNotVoting = () =>
  <div className="proposal-details-voting-not-voting"><T id="proposalDetails.votingInfo.notVoting" m="Proposal not yet on voting stage" /></div>;

export const ProposalVoted = () =>
  <div className="proposal-details-voting-voted"><T id="proposalDetails.votingInfo.voted" m="Voting has ended for this proposal" /></div>;

export const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noTickets" m="Voting is only available upon participation in Staking." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking" /></KeyBlueButton>
  </>
);

export const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noElligibleTickets" m="You don't have tickets elligible for voting on this proposal. Purchase tickets to vote on future proposals." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.purchaseTicketsBtn" m="Purchase Tickets" /></KeyBlueButton>
  </>
);

const VoteOption = ({ value, description, onClick, checked }) => (
  <div className="proposal-vote-option">
    <input className={value} type="radio" id={value} name="proposalVoteChoice" readOnly={!onClick} onChange={onClick ? () => onClick(value) : null}
      value={value} checked={checked} />
    <label className={"radio-label " + value} htmlFor={value}/>{description}
  </div>
);

export const ChooseVoteOption = ({ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice, currentVoteChoice, votingComplete, eligibleTicketCount }) => (
  <>
    <div className="proposal-details-voting-preference">
      <div className="proposal-details-voting-preference-title"><T id="proposalDetails.votingInfo.votingPreferenceTitle" m="My Voting Preference" /></div>
      <div className="proposal-details-current-choice-box">
        {voteOptions.map(o => (
          <VoteOption value={o.id} description={o.id.charAt(0).toUpperCase()+o.id.slice(1)} key={o.id} checked={currentVoteChoice !== "abstain" ? o.id === currentVoteChoice.id : null }
            onClick={ (currentVoteChoice === "abstain" && !votingComplete) ? onVoteOptionSelected : null }/>
        ))}
      </div>
    </div>
    {!votingComplete && <UpdateVoteChoiceModalButton {...{ newVoteChoice, onUpdateVoteChoice, eligibleTicketCount }} />}
  </>
);

export const UpdatingVoteChoice = () => (
  <div className="proposal-details-updating-vote-choice">
    <StakeyBounceXs />
    <T id="proposalDetails.votingInfo.updatingVoteChoice" m="Updating vote choice" />...
  </div>
);

export const OverviewField = showCheck(( { label, value } ) => (
  <div className="proposal-details-overview-field">
    <div className="label">{label}:</div>
    <div className="value">{value}</div>
  </div>
));

export const OverviewVotingProgressInfo = ({ voteCounts, quorumMinimumVotes }) => (
  <div className="proposal-details-voting-progress">
    <div className="proposal-details-voting-progress-counts">
      <div className="yes-count-box" />{voteCounts.yes}
      <div className="no-count-box" />{voteCounts.no}
      {/* // TODO: return if we have have quorum/total ticket counts available.
      <div className="abstain-count-box" /><T id="proposal.progressCount.abstain" m="{count} Abstain" values={{ count: voteCounts.abstain }} /> */}
    </div>

    <VotingProgress  {...{ voteCounts, quorumMinimumVotes }} />
  </div>
);

export const TimeValue = ({ timestamp, tsDate }) => (
  <>
    <span className="time-value"><FormattedRelative  value={ tsDate(timestamp) } /></span>
    (<T id="proposal.overview.fullTime" m="{timestamp, date, medium} {timestamp, time, short}" values={{ timestamp: tsDate(timestamp) }} />)
  </>
);

// This changes links to never open. Debatable whether we want to
// allow proposals to link somewhere directly from decrediton.
const renderInternalProposalLink = ({ children, href }) => (
  <InvisibleConfirmModalButton
    modalTitle={<T id="politeia.details.openLinkModal" m="Open Link in External Browser"/>}
    modalContent={
      <T id="politeia.details.openLinkModalDesc"
        m="Click Confirm to open the link: {link} in an external browser."
        values={{ link: <span className="prop-details-modal-link">{href}</span>
        }} />}
    buttonComponent={<span>{children}</span>}
    buttonLabel={<a onClick={() => {} } href="#">{children}</a>}
    onSubmit={() => shell.openExternal(href)}
  />
);

// This changes images to never open. Debatable whether we want to
// allow proposals to open images directly from decrediton.
const renderProposalImage = ({ alt }) => <span>{alt}</span>;

export const ProposalText = ({ text }) => (
  <>
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
        imageReference: renderProposalImage,
        image: renderProposalImage,

        html: () => null
      }}
    />
  </>
);

// politeiaMarkdownIndexMd returns markdown text from the payload of a politeia
// proposal file that corresponds to its index.md). This was extracted from the
// helpers.js file of politeia. Assumes the payload has been converted from
// base64 into bytes.
export function politeiaMarkdownIndexMd(payload) {
  let text = decodeURIComponent(escape(payload));
  return text.substring(text.indexOf("\n") + 1);
}
