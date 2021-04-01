import {
  classNames,
  Button,
  StatusBar,
  Tooltip,
  Text,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink } from "shared";
import { OverviewField, TimeValue, ProposalText, VoteSection } from "./helpers";
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
  //goBackHistory,
  linkedProposal
}) => {
  const { tsDate, hasTickets, isTestnet } = useProposalDetails();
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const shortToken = token.substring(0, 7);
  const shortRFPToken = linkedProposal?.token.substring(0, 7);
  const proposalPath = `/proposals/${shortToken}`;
  const votingActiveOrFinished =
    voteStatus === VOTESTATUS_ACTIVEVOTE ||
    voteStatus === VOTESTATUS_FINISHEDVOTE;
  return (
    <div>
      <div className={styles.overview}>
        <div className={styles.overviewInfoWrapper}>
          <div className={styles.overviewInfo}>
            <div className={styles.title}>{name}</div>
            {linkedProposal && (
              <div className={styles.proposedToRfp}>
                <T
                  id="proposal.overview.proposedToRfp.label"
                  m="Proposed for {linkedProposal}"
                  values={{
                    linkedProposal: (
                      <PoliteiaLink
                        isTestnet={isTestnet}
                        path={`/proposals/${shortRFPToken}`}>
                        {`${linkedProposal.name} (${shortRFPToken})`}
                      </PoliteiaLink>
                    )
                  }}
                />
              </div>
            )}
            <div className={styles.token}>
              <PoliteiaLink isTestnet={isTestnet} path={proposalPath}>
                {shortToken}
              </PoliteiaLink>
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
        </div>
        {votingActiveOrFinished && (
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
      {votingActiveOrFinished && (
        <VoteSection
          {...{
            hasTickets,
            walletEligibleTickets,
            viewedProposalDetails,
            proposalStatus,
            voteStatus,
            currentVoteChoice,
            newVoteChoice,
            setVoteOption,
            voteOptions,
            showPurchaseTicketsPage
          }}
        />
      )}
      <div className={styles.detailsText}>
        <ProposalText text={text} />
      </div>
      <div className={styles.piButtonWrapper}>
        <PoliteiaLink
          className={styles.piButton}
          path={proposalPath}
          CustomComponent={Button}
          isTestnet={isTestnet}>
          <T
            id="proposals.community.goToProposal"
            m="See proposal comments on Politeia"
          />
        </PoliteiaLink>
      </div>
    </div>
  );
};

export default ProposalDetails;
