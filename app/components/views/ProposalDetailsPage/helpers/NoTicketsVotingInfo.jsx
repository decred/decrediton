import styles from "../ProposalDetails.module.css";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <div className={styles.noTickets}>
      <T
        id="proposalDetails.votingInfo.noTickets"
        m="Voting is only available upon participation in Staking."
      />
    </div>
    <KeyBlueButton
      className={styles.overviewVotingButton}
      onClick={showPurchaseTicketsPage}>
      <T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking" />
    </KeyBlueButton>
  </>
);

export default NoTicketsVotingInfo;
