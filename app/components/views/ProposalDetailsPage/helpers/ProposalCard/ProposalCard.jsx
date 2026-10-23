import styles from "./ProposalCard.module.css";
import { classNames, StatusBar, Tooltip, Text, StatusTag } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink } from "shared";
import {
  VOTE_ENDS_EVENT,
  VOTE_ENDED_EVENT,
  PROPOSAL_UPDATED_EVENT
} from "../Event";
import Join from "../Join";
import Event from "../Event";

import { getStatusBarData, getProposalStatusTagProps } from "../../utils";

const ProposalCard = ({
  isTestnet,
  linkto,
  approved,
  totalVotes,
  endTimestamp,
  blocksLeft,
  name,
  username,
  timestamp,
  tsDate,
  version,
  proposalStatus,
  voteStatus,
  isDarkTheme,
  linkedProposal,
  quorumMinimumVotes,
  voteCounts,
  shortToken,
  shortRFPToken,
  proposalPath,
  isVoteActive,
  isVoteActiveOrFinished,
  isCardClickable,
  className
}) => (
  <div className={classNames(styles.overview, className)}>
    <div className={styles.overviewInfo}>
      <div className={styles.row}>
        <div className="flex-column">
          {isCardClickable ? (
            <div className={styles.titleText}>{name}</div>
          ) : (
            <div>
              <Tooltip
                content={<T id="proposal.overview.title" m="See on Politeia" />}
                contentClassName={styles.tooltipTitle}
                placement="right">
                <PoliteiaLink
                  className={styles.title}
                  isTestnet={isTestnet}
                  path={proposalPath}>
                  <div className={styles.titleText}>{name}</div>
                </PoliteiaLink>
              </Tooltip>
            </div>
          )}
          <Join className={classNames("margin-top-s", styles.subTitle)}>
            <span className={classNames("color-primary", styles.username)}>
              {username}
            </span>
            <Event
              eventType={PROPOSAL_UPDATED_EVENT}
              timestamp={timestamp}
              tsDate={tsDate}
              className={styles.updatedEvent}
            />
            <span className={styles.version}>
              <T id="proposal.overview.version.label" m="version" /> {version}
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
              linkedProposal: isCardClickable ? (
                <span>{`${linkedProposal.name} (${shortRFPToken})`}</span>
              ) : (
                <PoliteiaLink
                  isTestnet={isTestnet}
                  path={`/record/${shortRFPToken}`}>
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
);

export default ProposalCard;
