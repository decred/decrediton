import { classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import AgendaProgressIndicator from "./ProgressIndicator";
import styles from "./Overview.module.css";

const AgendaCard = ({ agenda, onClick, selectedChoice }) => (
  <div
    className={classNames(
      agenda.finished && styles.agendaCardDisabled,
      onClick && styles.agendaCard
    )}
    onClick={onClick}>
    <div className={styles.name}>{agenda.name}</div>
    <div className={styles.topPreference}>
      Preference:{" "}
      <span className={styles.textHighlightSmall}>{selectedChoice}</span>
    </div>
    <div className={styles.bottomCfg}>
      {`${agenda.description} `}
      <span className={styles.bottomCfgLast}>
        <T id="agenda.overview.idLabel" m="Agenda ID" />:
        <span className={styles.bottomCfgLastBold}>{agenda.name}</span>
      </span>
    </div>
    <AgendaProgressIndicator
      passed={agenda.passed}
      inProgress={!agenda.finished}
    />
  </div>
);

export default AgendaCard;
