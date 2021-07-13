import React from "react";
import { FormattedMessage as T } from "react-intl";
import { RadioButtonGroup } from "pi-ui";
import VotedCheckmark from "./VotedCheckmark";
import CastVoteModalButton from "./CastVoteModalButton";
import styles from "./VotePreference.module.css";

const VotePreference = React.memo(
  ({
    currentVoteChoice,
    eligibleTicketCount,
    newVoteChoice,
    voteOptions,
    votingComplete,
    onVoteSubmit,
    setVoteOption,
    votedSuccessfully
  }) => {
    return (
      <div className={styles.votePreference}>
        <div className={styles.preferenceTitle}>
          <T
            id="proposalDetails.votingInfo.votingPreferenceTitle"
            m="My voting preference:"
          />
        </div>
        <RadioButtonGroup
          className={styles.voteRadioButtons}
          options={voteOptions.map((o) => ({
            label: `${o.id.charAt(0).toUpperCase()}${o.id.slice(1)}`,
            value: o.id
          }))}
          onChange={(option) => setVoteOption(option.value)}
          value={newVoteChoice || currentVoteChoice?.id}
          disabled={votingComplete || votedSuccessfully}
          optionsClassName={voteOptions.map((o) => styles[o.id])}
        />
        {!votingComplete && !votedSuccessfully && newVoteChoice && (
          <CastVoteModalButton
            {...{
              newVoteChoice,
              onSubmit: onVoteSubmit,
              eligibleTicketCount
            }}
          />
        )}
        {votedSuccessfully && <VotedCheckmark />}
      </div>
    );
  }
);

export default VotePreference;
