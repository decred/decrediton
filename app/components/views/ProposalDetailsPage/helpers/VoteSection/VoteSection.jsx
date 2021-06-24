import { FormattedMessage as T } from "react-intl";
import styles from "./VoteSection.module.css";
import { VoteInfo } from "../";

const VoteSection = ({
  hasTickets,
  viewedProposalDetails,
  proposalStatus,
  voteStatus,
  currentVoteChoice,
  voteOptions,
  showPurchaseTicketsPage
}) => {
  const { eligibleTicketCount, hasEligibleTickets } = viewedProposalDetails;
  return (
    <div className={styles.voteSection}>
      <VoteInfo
        {...{
          hasTickets,
          proposalStatus,
          voteStatus,
          currentVoteChoice,
          viewedProposalDetails,
          showPurchaseTicketsPage,
          voteOptions
        }}
      />
      {hasEligibleTickets && (
        <div>
          <T
            id="proposals.detail.wallet.eligible.header"
            m="Tickets eligible for voting: "
          />
          <span className={styles.total}>{`${eligibleTicketCount}`}</span>
        </div>
      )}
    </div>
  );
};

export default VoteSection;
