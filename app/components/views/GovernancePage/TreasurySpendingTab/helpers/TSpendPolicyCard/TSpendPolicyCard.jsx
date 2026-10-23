import styles from "./TSpendPolicyCard.module.css";
import { TextHighlighted } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import VoteSection from "../VoteSection";
import { ExternalLink } from "shared";

const TSpendPolicyCard = ({
  hash,
  policies,
  policyOptions,
  vote,
  isLoading,
  txURLBuilder
}) => {
  const initSelectedValue =
    policies && (policies.find((tp) => tp.hash === hash)?.policy ?? "abstain");
  return (
    <div className={styles.overview}>
      <div className={styles.hashContainer}>
        <T id="treasurySpending.txhash" m="Tx hash:" />
        <TextHighlighted truncate={false} className={styles.hash}>
          <ExternalLink href={txURLBuilder(hash)}>{hash}</ExternalLink>
        </TextHighlighted>
      </div>

      <VoteSection
        {...{
          votingFor: hash,
          policyOptions,
          vote,
          isLoading,
          initSelectedValue:
            initSelectedValue === "" ? "abstain" : initSelectedValue
        }}
      />
    </div>
  );
};
export default TSpendPolicyCard;
