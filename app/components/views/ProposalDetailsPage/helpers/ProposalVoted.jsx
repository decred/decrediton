import styles from "../ProposalDetails.module.css";
import { FormattedMessage as T } from "react-intl";

const ProposalVoted = () => (
  <div className={styles.voted}>
    <T
      id="proposalDetails.votingInfo.voted"
      m="Voting has ended for this proposal"
    />
  </div>
);

export default ProposalVoted;
