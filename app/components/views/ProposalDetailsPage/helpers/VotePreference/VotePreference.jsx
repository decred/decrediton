import React from "react";
import { FormattedMessage as T } from "react-intl";
import { RadioButtonGroup } from "pi-ui";
import { PassphraseModalButton } from "buttons";
import VotedCheckmark from "./VotedCheckmark";
import styles from "./VotePreference.module.css";

// XXX move to a separate file
const UpdateVoteChoiceModalButton = ({
  onSubmit,
  newVoteChoice,
  eligibleTicketCount
}) => (
  <PassphraseModalButton
    modalTitle={
      <>
        <T id="proposals.updateVoteChoiceModal.title" m="Confirm Your Vote" />
        <div className={styles.voteConfirmation}>
          <div className={styles[`${newVoteChoice}Proposal`]} />
          {newVoteChoice}
        </div>
      </>
    }
    modalDescription={
      <T
        id="proposalDetails.votingInfo.eligibleCount"
        m="You have {count, plural, one {one ticket} other {# tickets}} eligible for voting"
        values={{ count: eligibleTicketCount }}
      />
    }
    onSubmit={onSubmit}
    className={styles.voteButton}
    buttonLabel={
      <T id="proposals.updateVoteChoiceModal.btnLabel" m="Cast Vote" />
    }
  />
);

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
          value={newVoteChoice || currentVoteChoice.id}
          disabled={votingComplete || votedSuccessfully}
          optionsClassName={voteOptions.map((o) => styles[o.id])}
        />
        {!votingComplete && !votedSuccessfully && newVoteChoice && (
          <UpdateVoteChoiceModalButton
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
