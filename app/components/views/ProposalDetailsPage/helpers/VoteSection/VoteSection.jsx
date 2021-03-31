import { FormattedMessage as T } from "react-intl";
import styles from "./VoteSection.module.css";
import { VoteInfo } from "../";

const VoteSection = ({
  hasTickets,
  viewedProposalDetails,
  proposalStatus,
  voteStatus,
  currentVoteChoice,
  newVoteChoice,
  setVoteOption,
  voteOptions,
  showPurchaseTicketsPage
}) => {
  const { eligibleTicketCount } = viewedProposalDetails;
  return (
    <div className={styles.voteSection}>
      <VoteInfo
        {...{
          hasTickets,
          proposalStatus,
          voteStatus,
          currentVoteChoice,
          viewedProposalDetails,
          newVoteChoice,
          setVoteOption,
          showPurchaseTicketsPage,
          voteOptions
        }}
      />
      <div>
        <T
          id="proposals.detail.wallet.eligible.header"
          m="Tickets eligible for voting: "
        />
        <span className={styles.total}>{`${eligibleTicketCount}`}</span>
      </div>
    </div>
  );
};

export default VoteSection;
