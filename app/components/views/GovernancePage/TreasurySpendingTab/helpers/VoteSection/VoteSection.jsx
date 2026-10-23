import { useState } from "react";
import styles from "./VoteSection.module.css";
import { RadioButtonGroup } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import CastVoteModalButton from "./CastVoteModalButton";

const VoteSection = ({
  votingFor,
  policyOptions,
  vote,
  initSelectedValue,
  isLoading
}) => {
  const [selected, setSelected] = useState(() => initSelectedValue);
  const updatePreferences = (passphrase) =>
    vote(votingFor, selected, passphrase);
  const handleChange = (option) => setSelected(option.value);

  return (
    <div className={styles.voteSection}>
      <div className={styles.votePreference}>
        <div className={styles.preferenceTitle}>
          {selected ? (
            <T id="treasurySpending.votedFor" m="Voted for:" />
          ) : (
            <T id="treasurySpending.votingFor" m="Voting for:" />
          )}
        </div>
        <RadioButtonGroup
          name={`${votingFor}-radioButtonGroup`}
          className={styles.voteRadioButtons}
          options={policyOptions}
          onChange={handleChange}
          value={selected}
          disabled={isLoading}
          optionsClassName={policyOptions.map((o) => styles[o.value])}
        />
        <CastVoteModalButton
          {...{
            newVoteChoice: selected,
            onSubmit: updatePreferences,
            isLoading
          }}
        />
      </div>
    </div>
  );
};

export default VoteSection;
