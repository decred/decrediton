import { Button, classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink } from "shared";
import { ProposalBody, VoteSection, ProposalCard } from "./helpers";
import { useProposalDetails } from "./hooks";
import styles from "./ProposalDetails.module.css";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED
} from "constants";

const ProposalDetails = ({
  viewedProposalDetails,
  viewedProposalDetails: {
    username,
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
    description
  },
  showPurchaseTicketsPage,
  goBackHistory,
  linkedProposal,
  isDarkTheme
}) => {
  const shortToken = token.substring(0, 7);
  const shortRFPToken = linkedProposal?.token.substring(0, 7);
  const { tsDate, hasTickets, isTestnet } = useProposalDetails();
  const proposalPath = `/record/${shortToken}`;
  const isVoteActive = voteStatus === PROPOSAL_VOTING_ACTIVE;
  const isVoteActiveOrFinished =
    isVoteActive ||
    voteStatus === PROPOSAL_VOTING_FINISHED ||
    voteStatus === PROPOSAL_VOTING_APPROVED ||
    voteStatus === PROPOSAL_VOTING_REJECTED;

  return (
    <div className={styles.detailsWrapper}>
      <div className={classNames(styles.cardWrapper)}>
        <div
          className={classNames(styles.backButton, "flex-centralize")}
          onClick={goBackHistory}>
          <div className={styles.backArrow}></div>
        </div>
        <ProposalCard
          {...{
            isTestnet,
            token,
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
            isVoteActiveOrFinished
          }}
        />
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
            voteOptions,
            showPurchaseTicketsPage
          }}
        />
      )}
      <div className={styles.detailsText}>
        <ProposalBody body={description} />
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
