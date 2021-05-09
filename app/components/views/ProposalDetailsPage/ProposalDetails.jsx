import { Button, classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink } from "shared";
import { ProposalBody, VoteSection } from "./helpers";
import { useProposalDetails } from "./hooks";
import ProposalCard from "./ProposalCard";
import styles from "./ProposalDetails.module.css";
import { PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED } from "constants";

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
  const shortToken = token.substring(0, 7);
  const shortRFPToken = linkedProposal?.token.substring(0, 7);
  const { tsDate, hasTickets, isTestnet } = useProposalDetails();
  const proposalPath = `/record/${shortToken}`;
  const isVoteActive = voteStatus === PROPOSAL_VOTING_ACTIVE;
  const isVoteActiveOrFinished =
    isVoteActive || voteStatus === PROPOSAL_VOTING_FINISHED;

  return (
    <div>
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
            creator,
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
