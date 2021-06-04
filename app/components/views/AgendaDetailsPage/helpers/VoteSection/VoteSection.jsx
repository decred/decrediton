import styles from "./VoteSection.module.css";
import { RadioButtonGroup } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import CastVoteModalButton from "./CastVoteModalButton";

const VoteSection = ({
  choices,
  selected,
  setSelected,
  finished,
  updatePreferences,
  isLoading
}) => {
  const options = choices
    .map(({ choiceId }) => ({
      label: choiceId,
      value: choiceId
    }))
    .reverse();
  const handleChange = (option) => setSelected(option.value);
  const showVotingOptions = !!options.length && (!finished || selected);
  return (
    showVotingOptions && (
      <div className={styles.voteSection}>
        <div className={styles.votePreference}>
          <div className={styles.preferenceTitle}>
            {finished && selected ? (
              <T id="agenda.votedFor" m="Voted for:" />
            ) : (
              <T id="agenda.votingFor" m="Voting for:" />
            )}
          </div>
          <RadioButtonGroup
            className={styles.voteRadioButtons}
            options={options}
            onChange={handleChange}
            value={selected}
            disabled={finished || isLoading}
            optionsClassName={options.map((o) => styles[o.value])}
          />
          {!finished && (
            <CastVoteModalButton
              {...{
                newVoteChoice: selected,
                onSubmit: updatePreferences,
                isLoading
              }}
            />
          )}
        </div>
      </div>
    )
  );
};

export default VoteSection;
