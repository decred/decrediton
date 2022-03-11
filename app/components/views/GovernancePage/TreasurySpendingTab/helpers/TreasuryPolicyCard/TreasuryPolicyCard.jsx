import styles from "./TreasuryPolicyCard.module.css";
import { TextHighlighted } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import VoteSection from "../VoteSection";

const TreasuryPolicyCard = ({
  piKey,
  treasuryPolicies,
  policyOptions,
  setTreasuryPolicy,
  isLoading
}) => (
  <div className={styles.overview}>
    <div className={styles.piKeyContainer}>
      <T id="treasurySpending.piKey" m="Pi key:" />
      <TextHighlighted truncate={false} className={styles.piKey}>
        {piKey}
      </TextHighlighted>
    </div>

    <VoteSection
      {...{
        piKey,
        treasuryPolicies,
        policyOptions,
        setTreasuryPolicy,
        isLoading
      }}
    />
  </div>
);
export default TreasuryPolicyCard;
