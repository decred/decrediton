import { FormattedMessage as T } from "react-intl";
import styles from "./GovernanceNotification.module.css";
import { useGovernanceNotification } from "./hooks";

const GovernanceNotification = () => {
  const {
    newNotYetVotedAgendasCount,
    newNotYetVotedActiveProposalsCount,
    goToConsensusChanges,
    goToActiveProposals
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
    </div>
  );
};

export default GovernanceNotification;
