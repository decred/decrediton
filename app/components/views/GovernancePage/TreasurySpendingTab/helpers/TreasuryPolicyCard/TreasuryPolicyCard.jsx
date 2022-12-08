import styles from "./TreasuryPolicyCard.module.css";
import { TextHighlighted } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import VoteSection from "../VoteSection";

const TreasuryPolicyCard = ({
  piKey,
  policies,
  policyOptions,
  vote,
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
        votingFor: piKey,
        policyOptions,
        vote,
        initSelectedValue:
          policies &&
          (policies.find((tp) => tp.key === piKey)?.policy ?? "abstain"),
        isLoading
      }}
    />
  </div>
);
export default TreasuryPolicyCard;
