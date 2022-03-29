import { useState } from "react";
import styles from "./VoteSection.module.css";
import { RadioButtonGroup } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import CastVoteModalButton from "./CastVoteModalButton";

const VoteSection = ({
  piKey,
  policyOptions,
  treasuryPolicies,
  setTreasuryPolicy,
  isLoading
}) => {
  const [selected, setSelected] = useState(
    () =>
      treasuryPolicies &&
      (treasuryPolicies.find((tp) => tp.key === piKey)?.policy ?? "abstain")
  );
  const updatePreferences = (passphrase) =>
    setTreasuryPolicy(piKey, selected, passphrase);
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
