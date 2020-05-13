import styles from "../ProposalDetails.module.css";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <div className={styles.noTickets}>
      <T
        id="proposalDetails.votingInfo.noElligibleTickets"
        m="You don't have tickets elligible for voting on this proposal. Purchase tickets to vote on future proposals."
      />
    </div>
    <KeyBlueButton
      className={styles.overviewVotingButton}
      onClick={showPurchaseTicketsPage}>
      <T
        id="proposalDetails.votingInfo.purchaseTicketsBtn"
        m="Purchase Tickets"
      />
    </KeyBlueButton>
  </>
);

export default NoElligibleTicketsVotingInfo;
