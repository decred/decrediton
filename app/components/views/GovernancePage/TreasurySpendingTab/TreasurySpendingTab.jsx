import { FormattedMessage as T } from "react-intl";
import PageHeader from "../PageHeader";
import styles from "./TreasurySpendingTab.module.css";
import { useTreasurySpending } from "./hooks";
import { TreasuryPolicyCard, TSpendPolicyCard } from "./helpers";
import { ExternalLink } from "shared";

const TreasurySpendingTab = () => {
  const {
    treasuryPolicies,
    setTreasuryPolicy,
    setTreasuryPolicyRequestAttempt,
    tspendPolicies,
    setTspendPolicy,
    setTSpendPolicyRequestAttempt,
    policyOptions,
    dcrdSourceLink,
    PiKeys,
    txURLBuilder
  } = useTreasurySpending();

  return (
    <>
      <div className={styles.headerWrapper}>
        <PageHeader
          title={<T id="treasurySpending.title" m="Treasury Spending" />}
          description={
            <T
              id="treasurySpending.description"
              m="Spending treasury funds now requires stakeholders to vote on the expenditure. You can participate and set a voting policy for treasury spending by a particular Politeia Key or Tspend transaction. The keys can be verified in the {link}."
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
        <div className={styles.tspendTitle}>
          <T id="pkeys.title" m="Politeia Keys" />
        </div>
        {PiKeys.map((piKey) => (
          <div className={styles.cardWrapper} key={piKey}>
            <TreasuryPolicyCard
              {...{
                policyOptions,
                piKey,
                policies: treasuryPolicies,
                vote: setTreasuryPolicy,
                isLoading: !!setTreasuryPolicyRequestAttempt
              }}
            />
          </div>
        ))}
        {tspendPolicies?.length > 0 && (
          <>
            <div className={styles.tspendTitle}>
              <T id="tspend.title" m="Tspends" />
            </div>
            {tspendPolicies.map((tspendPolicy) => (
              <div className={styles.cardWrapper} key={tspendPolicy.hash}>
                <TSpendPolicyCard
                  {...{
                    policyOptions,
                    hash: tspendPolicy.hash,
                    policies: tspendPolicies,
                    vote: setTspendPolicy,
                    isLoading: !!setTSpendPolicyRequestAttempt,
                    txURLBuilder
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default TreasurySpendingTab;
