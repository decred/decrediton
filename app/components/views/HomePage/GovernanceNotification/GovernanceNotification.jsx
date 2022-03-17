import { FormattedMessage as T } from "react-intl";
import styles from "./GovernanceNotification.module.css";
import { useGovernanceNotification } from "./hooks";

const GovernanceNotification = () => {
  const {
    newNotYetVotedAgendasCount,
    goToConsensusChanges
  } = useGovernanceNotification();

  return (
    <div className={styles.votes}>
      {newNotYetVotedAgendasCount > 0 ? (
        <a className={styles.consensusAgendas} onClick={goToConsensusChanges}>
          <T
            id="home.newNotYetVotedAgendasCount"
            m="{count, plural, one {1 new consensus agenda} other {# new consensus agendas}}"
            values={{ count: newNotYetVotedAgendasCount }}
          />
        </a>
      ) : null}
    </div>
  );
};

export default GovernanceNotification;
