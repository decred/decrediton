import { FormattedMessage as T } from "react-intl";
import styles from "./GovernanceNotification.module.css";
import { useGovernanceNotification } from "./hooks";

const GovernanceNotification = () => {
  const {
    newNotYetVotedAgendasCount,
    newNotYetVotedActiveProposalsCount,
    newNotYetVotedTSpendCount,
    goToConsensusChanges,
    goToActiveProposals,
    goToTreasurySpending
  } = useGovernanceNotification();

  return (
    <div className={styles.votes}>
      {newNotYetVotedAgendasCount > 0 ? (
        <a onClick={goToConsensusChanges}>
          <T
            id="home.newNotYetVotedAgendasCount"
            m="{count, plural, one {1 new consensus agenda} other {# new consensus agendas}}"
            values={{ count: newNotYetVotedAgendasCount }}
          />
        </a>
      ) : null}
      {newNotYetVotedActiveProposalsCount > 0 ? (
        <a onClick={goToActiveProposals}>
          <T
            id="home.newNotYetVotedActiveProposalsCount"
            m="{count, plural, one {1 active proposal} other {# new active proposals}}"
            values={{ count: newNotYetVotedActiveProposalsCount }}
          />
        </a>
      ) : null}
      {newNotYetVotedTSpendCount > 0 ? (
        <a onClick={goToTreasurySpending}>
          <T
            id="home.newNotYetVotedTSpendCount"
            m="{count, plural, one {1 active tspend} other {# new active tspends}}"
            values={{ count: newNotYetVotedTSpendCount }}
          />
        </a>
      ) : null}
    </div>
  );
};

export default GovernanceNotification;
