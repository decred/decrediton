import styles from "../ProposalDetails.module.css";
import { FormattedMessage as T } from "react-intl";

const ProposalAbandoned = () => (
  <div className={styles.notVoting}>
    <T
      id="proposalDetails.votingInfo.abandoned"
      m="Proposal has been abandoned"
    />
  </div>
);

export default ProposalAbandoned;
