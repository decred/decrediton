import { useState, useMemo } from "react";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
import { PoliteiaLink, VerticalAccordion } from "shared";
import {
  ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
  NoElligibleTicketsVotingInfo, TimeValue, ProposalText, ProposalAbandoned
} from "./helpers";
import ChooseVoteOption from "./ChooseVoteOption.jsx";
import {
  VOTESTATUS_ACTIVEVOTE, VOTESTATUS_FINISHEDVOTE, PROPOSALSTATUS_ABANDONED
} from "actions/GovernanceActions";
import { useProposalDetails } from "./hooks";
import styles from "./ProposalDetails.module.css";

function ProposalDetails ({
  viewedProposalDetails, showPurchaseTicketsPage, setVoteOption,
  newVoteChoice, text, goBackHistory, eligibleTicketCount
}) {
  const {
    creator, timestamp, endTimestamp, currentVoteChoice, hasEligibleTickets,
    name, token, voteStatus, proposalStatus, voteOptions, voteCounts,
    version, quorumMinimumVotes, walletEligibleTickets
  } = viewedProposalDetails;
  const [ showWalletEligibleTickets, toggleWalletEligibleTickets ] = useState(false);
  const { tsDate, hasTickets } = useProposalDetails();

  const voteInfo = useMemo(() => {
    if (proposalStatus === PROPOSALSTATUS_ABANDONED) {
      return <ProposalAbandoned />;
    }
    if (voteStatus === VOTESTATUS_FINISHEDVOTE) {
      return <ChooseVoteOption {...{ voteOptions, currentVoteChoice, votingComplete: true }} />;
    }
    if (voteStatus === VOTESTATUS_ACTIVEVOTE) {
      if (!hasTickets) {
        return <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
      }
      if (!hasEligibleTickets) {
        return <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
      }
      return <ChooseVoteOption {...{
        viewedProposalDetails, voteOptions, setVoteOption, newVoteChoice,
        eligibleTicketCount, currentVoteChoice, votingComplete: false
      }} />;
    }
    return <ProposalNotVoting />;
  }, [ proposalStatus, voteStatus, hasTickets, hasEligibleTickets, currentVoteChoice, viewedProposalDetails, eligibleTicketCount, newVoteChoice, setVoteOption, showPurchaseTicketsPage, voteOptions ]);

  return (
    <div className={styles.proposalDetails}>
      <div className={styles.overview}>
        <div className="is-row">
          <div className={styles.overviewInfo}>
            <InvisibleButton className={styles.smallWidth} onClick={goBackHistory} />
            <div className={styles.title}>{name}</div>
            <div className={styles.token}>
              <PoliteiaLink path={"/proposals/"+token}>{token}</PoliteiaLink>
            </div>
            <div className={styles.fields}>
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
                show={voteStatus === VOTESTATUS_ACTIVEVOTE && endTimestamp}
                label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
                value={<TimeValue timestamp={endTimestamp} tsDate={tsDate} /> } />
            </div>
          </div>
          <div className={styles.overviewVoting}>
            <InvisibleButton className={styles.backIconButton} onClick={goBackHistory} />
            {voteInfo}
          </div>
        </div>
        { (voteStatus === VOTESTATUS_ACTIVEVOTE || voteStatus === VOTESTATUS_FINISHEDVOTE ) &&
            <OverviewVotingProgressInfo {...{ voteCounts, quorumMinimumVotes }} /> }
        <div>
          { walletEligibleTickets &&
            <VerticalAccordion
              header = {
                <div className="proposal-details-wallet-eligible-tickets-header">
                  <T id="proposals.detail.wallet.eligible.header" m="Wallet Eligible Tickets " />
                </div>
              }
              show={showWalletEligibleTickets}
              onToggleAccordion={ () => toggleWalletEligibleTickets(!showWalletEligibleTickets)}
              className="proposal-details-wallet-eligible-tickets"
            >
              {walletEligibleTickets.map((t, i) => (
                <div className="is-row proposal-details-wallet-eligible-tickets-row" key={`ticket-${i+1}`}>
                  <div className="is-row proposal-details-wallet-eligible-tickets-label">
                    <T id="proposals.detail.tickets" m="Ticket " />{i+1}: </div>
                  <div>
                    {t.ticket}
                  </div>
                </div>
              ))}
            </VerticalAccordion>
          }
        </div>
      </div>
      <div className={styles.detailsText}>
        <div className={styles.links}>
          <PoliteiaLink path={"/proposals/"+token} isButton>
            <T id="proposals.community.goToProposal" m="See proposal comments on Politeia" />
          </PoliteiaLink>
        </div>
        <ProposalText text={text} />
      </div>
    </div>
  );
}

export default ProposalDetails;
