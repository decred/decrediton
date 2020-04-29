import { useState } from "react";
import { classNames, Button } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
import { PoliteiaLink, VerticalAccordion } from "shared";
import {
  OverviewField,
  OverviewVotingProgressInfo,
  TimeValue,
  ProposalText,
  VoteInfo
} from "./helpers";
import {
  VOTESTATUS_ACTIVEVOTE,
  VOTESTATUS_FINISHEDVOTE
} from "actions/GovernanceActions";
import { useProposalDetails } from "./hooks";
import styles from "./ProposalDetails.module.css";

const ProposalDetails = ({
  viewedProposalDetails,
  viewedProposalDetails: {
    creator,
    timestamp,
    endTimestamp,
    currentVoteChoice,
    hasEligibleTickets,
    name,
    token,
    voteStatus,
    proposalStatus,
    voteOptions,
    voteCounts,
    version,
    quorumMinimumVotes,
    walletEligibleTickets
  },
  showPurchaseTicketsPage,
  setVoteOption,
  newVoteChoice,
  text,
  goBackHistory,
  eligibleTicketCount
}) => {
  const [showWalletEligibleTickets, toggleWalletEligibleTickets] = useState(
    false
  );
  const { tsDate, hasTickets, isTestnet } = useProposalDetails();

  return (
    <div>
      <div className={styles.overview}>
        <div className={styles.overviewInfoWrapper}>
          <div className={styles.overviewInfo}>
            <div className={styles.title}>{name}</div>
            <div className={styles.token}>
              <PoliteiaLink path={"/proposals/" + token}>{token}</PoliteiaLink>
            </div>
            <div className={styles.fields}>
              <OverviewField
                label={
                  <T id="proposal.overview.created.label" m="Created by" />
                }
                value={creator}
              />
              <OverviewField
                label={<T id="proposal.overview.version.label" m="Version" />}
                value={version}
              />
              <OverviewField
                label={
                  <T
                    id="proposal.overview.lastUpdated.label"
                    m="Last Updated"
                  />
                }
                value={<TimeValue timestamp={timestamp} tsDate={tsDate} />}
              />
              <OverviewField
                show={voteStatus === VOTESTATUS_ACTIVEVOTE && endTimestamp}
                label={
                  <T
                    id="proposal.overview.deadline.label"
                    m="Voting Deadline"
                  />
                }
                value={<TimeValue timestamp={endTimestamp} tsDate={tsDate} />}
              />
            </div>
          </div>
          <div className={styles.overviewVoting}>
            <InvisibleButton
              className={styles.backIconButton}
              onClick={goBackHistory}
            />
            <VoteInfo
              proposalStatus={proposalStatus}
              voteStatus={voteStatus}
              hasTickets={hasTickets}
              hasEligibleTickets={hasEligibleTickets}
              currentVoteChoice={currentVoteChoice}
              viewedProposalDetails={viewedProposalDetails}
              eligibleTicketCount={eligibleTicketCount}
              newVoteChoice={newVoteChoice}
              setVoteOption={setVoteOption}
              showPurchaseTicketsPage={showPurchaseTicketsPage}
              voteOptions={voteOptions}
            />
          </div>
        </div>
        {(voteStatus === VOTESTATUS_ACTIVEVOTE ||
          voteStatus === VOTESTATUS_FINISHEDVOTE) && (
          <OverviewVotingProgressInfo {...{ voteCounts, quorumMinimumVotes }} />
        )}
        <div>
          {walletEligibleTickets && (
            <VerticalAccordion
              header={
                <div>
                  <T
                    id="proposals.detail.wallet.eligible.header"
                    m="Wallet Eligible Tickets "
                  />
                </div>
              }
              show={showWalletEligibleTickets}
              onToggleAccordion={() =>
                toggleWalletEligibleTickets(!showWalletEligibleTickets)
              }
              className={styles.walletEligibleTickets}
              headerClassName={styles.walletEligibleTicketsHeader}
              arrowClassName={styles.walletEligibleTicketsArrow}>
              {walletEligibleTickets.map((t, i) => (
                <div
                  className={classNames(
                    "is-row",
                    styles.walletEligibleTicketsRow
                  )}
                  key={`ticket-${i + 1}`}>
                  <div className={styles.walletEligibleTicketsLabel}>
                    <T id="proposals.detail.tickets" m="Ticket " />
                    {i + 1}:{" "}
                  </div>
                  <div>{t.ticket}</div>
                </div>
              ))}
            </VerticalAccordion>
          )}
        </div>
      </div>
      <div className={styles.detailsText}>
        <div className={styles.links}>
          <PoliteiaLink
            className={styles.politeiaButton}
            path={`/proposals/${token}`}
            CustomComponent={Button}
            isTestnet={isTestnet}>
            <T
              id="proposals.community.goToProposal"
              m="See proposal comments on Politeia"
            />
          </PoliteiaLink>
        </div>
        <ProposalText text={text} />
      </div>
    </div>
  );
};

export default ProposalDetails;
