import { classNames, Button, StatusBar, Tooltip, Text, StatusTag } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink } from "shared";
import {
  Event,
  VOTE_ENDS_EVENT,
  VOTE_ENDED_EVENT,
  PROPOSAL_UPDATED_EVENT,
  ProposalBody,
  VoteSection,
  Join
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
    blocksLeft,
    approved,
    body
  },
  showPurchaseTicketsPage,
  setVoteOption,
  newVoteChoice,
  goBackHistory,
  linkedProposal,
  isDarkTheme
}) => {
  const { tsDate, hasTickets, isTestnet } = useProposalDetails();
  const shortToken = token.substring(0, 7);
  const shortRFPToken = linkedProposal?.token.substring(0, 7);
  const proposalPath = `/proposals/${shortToken}`;
  const isVoteActive = voteStatus === PROPOSAL_VOTING_ACTIVE;
  const isVoteActiveOrFinished =
    isVoteActive || voteStatus === PROPOSAL_VOTING_FINISHED;

  return (
    <div>
      <div className={styles.cardWrapper}>
        <div
          className={classNames(styles.backButton, "flex-centralize")}
          onClick={goBackHistory}>
          <div className={styles.backArrow}></div>
        </div>
        <div className={styles.overview}>
          <div className={styles.overviewInfo}>
            <div className={styles.row}>
              <div className="flex-column">
                <Tooltip
                  content={
                    <T id="proposal.overview.title" m="See on Politeia" />
                  }>
                  <PoliteiaLink
                    className={styles.title}
                    isTestnet={isTestnet}
                    path={proposalPath}>
                    {name}
                  </PoliteiaLink>
                </Tooltip>
                <Join className={classNames("margin-top-s", styles.subTitle)}>
                  <span className="color-primary">{creator}</span>
                  <Event
                    eventType={PROPOSAL_UPDATED_EVENT}
                    timestamp={timestamp}
                    tsDate={tsDate}
                    className={styles.updatedEvent}
                  />
                  <span className={styles.version}>
                    <T id="proposal.overview.version.label" m="version" />{" "}
                    {version}
                  </span>
                </Join>
              </div>
              <div className={classNames("flex-column", "align-end")}>
                <StatusTag
                  className={styles.statusTag}
                  {...getProposalStatusTagProps(
                    { status: proposalStatus, linkto },
                    { status: voteStatus, approved },
                    isDarkTheme
                  )}
                />
                <div
                  className={classNames(
                    "margin-top-s",
                    styles.token,
                    isDarkTheme && styles.dark
                  )}>
                  {shortToken}
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
          </div>
          {isVoteActiveOrFinished && (
            <div className={classNames("flex-row", styles.statusBarRow)}>
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
              <div className={classNames("flex-column", styles.voteEnd)}>
                <Event
                  eventType={isVoteActive ? VOTE_ENDS_EVENT : VOTE_ENDED_EVENT}
                  timestamp={endTimestamp}
                  tsDate={tsDate}
                />
                {isVoteActive && (
                  <div>
                    {blocksLeft}{" "}
                    <T id="proposal.overview.blocksLeft" m="blocks left" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
        <ProposalBody body={body} />
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
