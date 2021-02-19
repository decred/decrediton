import { RadioButtonGroup, classNames } from "pi-ui";
import { PassphraseModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import ProgressIndicator from "./ProgressIndicator";
import styles from "./Overview.module.css";

const AgendaDetails = ({ name, onClose, description }) => (
  <div className={styles.overview}>
    <div className={styles.titleArea}>
      <a className={styles.overviewTitleClose} onClick={onClose} />
      <div className={styles.titleName}>{name}</div>
    </div>
    <div className={styles.text}>
      <div>{description}</div>
      <div className={styles.idCt}>
        <T id="agenda.card.idLabel" m="Agenda ID" />:{" "}
        <span className={styles.id}>{name}</span>
      </div>
      <div>
        <T
          id="agenda.overviewDescription"
          m="Once the majority of the PoW miners have upgraded (75% of the 100 most recent blocks are at the latest version) and the majority of the PoS miners have upgraded (75% of the votes in a 2016 block interval), the voting process begins."
        />
      </div>
    </div>
  </div>
);

const AgendaVotingOptions = ({
  choices,
  selected,
  setSelected,
  finished,
  disabled
}) => {
  const options = choices.map(({ choiceId }) => ({
    label: choiceId,
    value: choiceId
  }));
  const handleChange = (option) => setSelected(option.value);
  const showVotingOptions = !!options.length && (!finished || selected);

  return (
    showVotingOptions && (
      <div
        className={classNames(styles.optionsArea, disabled && styles.disabled)}>
        {finished && selected ? (
          <T id="agenda.votedFor" m="Voted for" />
        ) : (
          <T id="agenda.votingFor" m="Voting for" />
        )}
        :
        <div className={styles.radioButtonsWrapper}>
          <RadioButtonGroup
            className={styles.optionsGroup}
            vertical
            options={options}
            value={selected}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      </div>
    )
  );
};

const Overview = ({
  isFinished,
  agendaId,
  agendaDescription,
  choices,
  selectedChoiceId,
  closeCurrentAgenda,
  setSelectedChoiceId,
  updatePreferences,
  disabled,
  passed,
  isLoading
}) => (
  <div className={styles.agenda}>
    <AgendaDetails
      name={agendaId}
      description={agendaDescription}
      onClose={closeCurrentAgenda}
    />
    <AgendaVotingOptions
      choices={choices}
      selected={selectedChoiceId}
      setSelected={setSelectedChoiceId}
      finished={isFinished}
      disabled={disabled}
    />
    <div className={styles.bottom}>
      <div className={styles.bottomOptions}>
        <PassphraseModalButton
          modalTitle={<T id="updateprefs.passphrase.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={updatePreferences}
          className={styles.updatePreferencesButton}
          disabled={disabled || isLoading}
          buttonLabel={
            isLoading ? (
              <T id="agenda.settingVoteChoices" m="Updating" />
            ) : (
              <T id="agenda.updatePreference" m="Update Preference" />
            )
          }
        />
      </div>
      <div className={styles.bottomOverview}>
        <ProgressIndicator passed={passed} inProgress={!isFinished} />
      </div>
    </div>
  </div>
);

export default Overview;
