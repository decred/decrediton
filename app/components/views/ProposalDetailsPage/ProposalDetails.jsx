import {
  classNames,
  Button,
  StatusBar,
  Tooltip,
  Text,
  useTheme,
  StatusTag,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink } from "shared";
import {
  OverviewField,
  Event,
  VOTE_ENDS_EVENT,
  VOTE_ENDED_EVENT,
  ProposalText,
  VoteSection
} from "./helpers";
import { getStatusBarData, getProposalStatusTagProps } from "./utils";
import { PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED } from "constants";
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
    walletEligibleTickets,
    linkto,
    blocksLeft
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
  const isVoteActive = voteStatus === PROPOSAL_VOTING_ACTIVE;
  const isVoteActiveOrFinished =
    isVoteActive || voteStatus === PROPOSAL_VOTING_FINISHED;

  return (
    <div>
      <div className={styles.overview}>
        <div className={styles.overviewInfo}>
          <div className={styles.row}>
            <div className={styles.title}>{name}</div>
            <div className={styles.column}>
              <StatusTag
                className={styles.statusTag}
                {...getProposalStatusTagProps(
                  { status: proposalStatus, linkto },
                  voteStatus,
                  isDarkTheme
                )}
              />
              <Event
                className={styles.voteEvent}
                eventType={isVoteActive ? VOTE_ENDS_EVENT : VOTE_ENDED_EVENT}
                timestamp={endTimestamp}
                tsDate={tsDate}
              />
              <div>
                {blocksLeft}{" "}
                <T id="proposal.overview.blocksLeft" m="blocks left" />
              </div>
            </div>
          </div>
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
          <div>
            <OverviewField
              label={<T id="proposal.overview.created.label" m="Created by" />}
              value={creator}
            />
            <OverviewField
              label={<T id="proposal.overview.version.label" m="Version" />}
              value={version}
            />
            <OverviewField
              label={
                <T id="proposal.overview.lastUpdated.label" m="Last Updated" />
              }
              value={<Event timestamp={timestamp} tsDate={tsDate} />}
            />
          </div>
        </div>
        {isVoteActiveOrFinished && (
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
      {isVoteActiveOrFinished && (
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
