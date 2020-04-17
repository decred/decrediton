import { shell } from "electron";
import { KeyBlueButton, InvisibleConfirmPoliteiaModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { VotingProgress } from "indicators";
import { showCheck } from "helpers";
import { default as ReactMarkdown }  from "react-markdown";
import { FormattedRelative } from "shared";
import styles from "./ProposalDetails.module.css";

export const ProposalError = ( { error } ) => <div><T id="proposalDetails.loadingError" m="Error loading Proposal: {error}" values={{ error }} /></div>;

export const ProposalAbandoned = () =>
  <div className={styles.notVoting}><T id="proposalDetails.votingInfo.abandoned" m="Proposal has been abandoned" /></div>;

export const ProposalNotVoting = () =>
  <div className={styles.notVoting}><T id="proposalDetails.votingInfo.notVoting" m="Proposal not yet on voting stage" /></div>;

export const ProposalVoted = () =>
  <div className={styles.voted}><T id="proposalDetails.votingInfo.voted" m="Voting has ended for this proposal" /></div>;

export const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <div className={styles.noTickets}><T id="proposalDetails.votingInfo.noTickets" m="Voting is only available upon participation in Staking." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking" /></KeyBlueButton>
  </>
);

export const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <div className={styles.noTickets}><T id="proposalDetails.votingInfo.noElligibleTickets" m="You don't have tickets elligible for voting on this proposal. Purchase tickets to vote on future proposals." /></div>
    <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.purchaseTicketsBtn" m="Purchase Tickets" /></KeyBlueButton>
  </>
);

export const OverviewField = showCheck(( { label, value } ) => (
  <div className={styles.overviewField}>
    <div className={styles.label}>{label}:</div>
    <div className={styles.value}>{value}</div>
  </div>
));

export const OverviewVotingProgressInfo = ({ voteCounts, quorumMinimumVotes }) => (
  <div className={styles.votingProgressWrapper}>
    <div className={styles.votingProgress}>
      <div className={styles.progressCounts}>
        <div className={styles.yesCountBox} />{voteCounts.yes}
        <div className={styles.noCountBox} />{voteCounts.no}
        {/* // TODO: return if we have have quorum/total ticket counts available.
        <div className={styles.abstainCountBox /><T id="proposal.progressCount.abstain" m="{count} Abstain" values={{ count: voteCounts.abstain }} /> */}
      </div>

      <VotingProgress  className={styles.progressIndicator} {...{ voteCounts, quorumMinimumVotes }} />
    </div>
  </div>
);

export const TimeValue = ({ timestamp, tsDate }) => (
  <>
    <span className={styles.timeValue}><FormattedRelative  value={ tsDate(timestamp) } /></span>
    (<T id="proposal.overview.fullTime" m="{timestamp, date, medium} {timestamp, time, short}" values={{ timestamp: tsDate(timestamp) }} />)
  </>
);

// This changes links to never open. Debatable whether we want to
// allow proposals to link somewhere directly from decrediton.
const renderInternalProposalLink = ({ children, href }) => (
  <InvisibleConfirmPoliteiaModalButton
    modalTitle={<T id="politeia.details.openLinkModal" m="Open Link in External Browser"/>}
    modalContent={
      <T id="politeia.details.openLinkModalDesc"
        m="Click Confirm to open the link: {link} in an external browser."
        values={{ link: <span>{href}</span>
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
