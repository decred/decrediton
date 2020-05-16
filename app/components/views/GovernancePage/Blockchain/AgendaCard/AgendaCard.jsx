import { classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import AgendaFinishedIndicator from "./AgendaFinishedIndicator";
import styles from "./AgendaCard.module.css";

const AgendaCard = ({ agenda, onClick, selectedChoice }) => (
  <div
    className={classNames(
      agenda.finished && styles.agendaCardDisabled,
      onClick && styles.agendaCard
    )}>
    <div className={styles.bottom}>
      {agenda.finished ? (
        <AgendaFinishedIndicator passed={agenda.passed} />
      ) : (
        <div className={styles.indicatorPending}>
          <T id="agenda.card.inProgressIndicator" m="In Progress" />
        </div>
      )}
      <div className={styles.bottomCfg}>
        {agenda.description}{" "}
        <span className={styles.bottomCfgLast}>
          <T id="agenda.overview.idLabel" m="Agenda ID" />:
          <span className={styles.bottomCfgLastBold}>{agenda.name}</span>
        </span>
      </div>
    </div>
    <div className={styles.top}>
      <div className={styles.name}>{agenda.name}</div>
      <div className={styles.topPreference}>
        Preference:{" "}
        <span className={styles.textHighlightSmall}>{selectedChoice}</span>
      </div>
    </div>
  </div>
);

export default AgendaCard;
