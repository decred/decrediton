import { classNames, Button, StatusBar, Tooltip, Text, useTheme } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
import { PoliteiaLink } from "shared";
import {
  OverviewField,
  TimeValue,
  ProposalText,
  VoteInfo,
  EligibleTickets
} from "./helpers";
import { getStatusBarData } from "./utils";
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
    totalVotes,
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
  const { tsDate, hasTickets, isTestnet } = useProposalDetails();
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "theme-dark";
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
          <StatusBar
            className={styles.voteStatusBar}
            max={quorumMinimumVotes}
            status={getStatusBarData(voteCounts)}
            showMarker={false}
            renderStatusInfoComponent={
              <Tooltip
                className={classNames(
                  styles.quorumTooltip,
                  isDarkTheme && styles.darkQuorumTooltip
                )}
                content={`${totalVotes} votes cast, quorum requirement is ${quorumMinimumVotes} votes`}>
                <Text className={styles.votesReceived} size="small">
                  {totalVotes}
                </Text>
                <Text className={styles.votesQuorum} size="small">
                  /{`${quorumMinimumVotes} votes`}
                </Text>
              </Tooltip>
            }
          />
        )}
      </div>
      {walletEligibleTickets && (
        <EligibleTickets
          tickets={walletEligibleTickets}
          tsDate={tsDate}
          voteChoice={newVoteChoice || currentVoteChoice.id}
        />
      )}
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
