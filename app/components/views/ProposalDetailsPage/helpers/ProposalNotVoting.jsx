import styles from "../ProposalDetails.module.css";
import { FormattedMessage as T } from "react-intl";

const ProposalNotVoting = () => (
  <div className={styles.notVoting}>
    <T
      id="proposalDetails.votingInfo.notVoting"
      m="Proposal not yet on voting stage"
    />
  </div>
);

export default ProposalNotVoting;
