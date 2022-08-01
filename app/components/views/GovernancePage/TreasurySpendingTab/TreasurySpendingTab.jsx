import { FormattedMessage as T } from "react-intl";
import PageHeader from "../PageHeader";
import styles from "./TreasurySpendingTab.module.css";
import { useTreasurySpending } from "./hooks";
import { TreasuryPolicyCard } from "./helpers";
import { ExternalLink } from "shared";

const TreasurySpendingTab = () => {
  const {
    setTreasuryPolicy,
    policyOptions,
    treasuryPolicies,
    dcrdSourceLink,
    PiKeys,
    isLoading
  } = useTreasurySpending();

  return (
    <>
      <div className={styles.headerWrapper}>
        <PageHeader
          title={<T id="treasurySpending.title" m="Treasury Spending" />}
          description={
            <T
              id="treasurySpending.description"
              m="Spending treasury funds now requires stakeholders to vote on the expenditure. You can participate and set a voting policy for treasury spending by a particular Politeia Key. The keys can be verified in the {link}."
              values={{
                link: (
                  <ExternalLink
                    className={styles.proposalsLink}
                    href={dcrdSourceLink}>
                    dcrd source code
                  </ExternalLink>
                )
              }}
            />
          }
        />
      </div>
      <div className={styles.pikeysWrapper}>
        {PiKeys.map((piKey) => (
          <div className={styles.cardWrapper} key={piKey}>
            <TreasuryPolicyCard
              {...{
                piKey,
                policyOptions,
                treasuryPolicies,
                setTreasuryPolicy,
                isLoading
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default TreasurySpendingTab;
