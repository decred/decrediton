import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import AgendaFinishedIndicator from "../FinishedIndicator/FinishedIndicator";
import styles from "./Overview.module.css";

const Overview = ({
  isFinished,
  agendaId,
  agendaDescription,
  choices,
  selectedChoiceId,
  hasModifiedChoice,
  closeCurrentAgenda,
  setSelecedChoiceId,
  updatePreferences,
  disabled,
  passed
}) => (
  <div className={styles.agenda}>
    <div className={styles.overview}>
      <div className={styles.overviewTitleArea}>
        <a
          className={styles.overviewTitleClose}
          onClick={closeCurrentAgenda}></a>
        <div className={styles.overviewTitleName}>{agendaId}</div>
      </div>
      <div className={styles.middl}>
        <div className={styles.text}>
          <div>{agendaDescription}</div>
          <div className={styles.idCt}>
            <T id="agenda.card.idLabel" m="Agenda ID" />:{" "}
            <span className={styles.id}>{agendaId}</span>
          </div>
          <div>
            <T
              id="agenda.overviewDescription"
              m="Once the majority of the PoW miners have upgraded (75% of the 100 most recent blocks are at the latest version) and the majority of the PoS miners have upgraded (75% of the votes in a 2016 block interval), the voting process begins."
            />
          </div>
        </div>
      </div>
    </div>
    <div className={styles.optionsArea}>
      <div className={styles.optionsSection}>
        <div className={styles.nameOptions}>
          <T id="agenda.votingFor" m="Voting for" />
        </div>
      </div>
      <div>
        {choices.map(({ choiceId }) => (
          <label
            className={styles.optionsRadioLabel}
            htmlFor={choiceId}
            key={agendaId + choiceId}>
            {choiceId}
            <input
              disabled={disabled}
              className={styles.optionsRadio}
              id={choiceId}
              type="radio"
              name="field"
              value={choiceId}
              checked={selectedChoiceId === choiceId}
              onChange={(e) => setSelecedChoiceId(e.target.value)}
            />
            <span className="checkmark"></span>
          </label>
        ))}
      </div>
    </div>
    <div className={styles.bottom}>
      <div className={styles.bottomOverview}>
        {isFinished ? (
          <AgendaFinishedIndicator passed={passed} />
        ) : (
          <div>
            <T id="agenda.overview.inProgressIndicator" m="In Progress" />
          </div>
        )}
      </div>
      <div className={styles.bottomOptions}>
        <KeyBlueButton
          disabled={!hasModifiedChoice || disabled}
          className={styles.updatePreferencesButton}
          onClick={updatePreferences}>
          <T id="agenda.updatePreference" m="Update Preference" />
        </KeyBlueButton>
      </div>
    </div>
  </div>
);

export default Overview;
