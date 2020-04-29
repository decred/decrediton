import React from "react";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "../ProposalDetails.module.css";
import { PassphraseModalButton } from "buttons";

const VoteOption = React.memo(
  ({ value, description, onClick, checked, votingComplete }) => (
    <div className={styles.voteOption}>
      <input
        className={styles[value]}
        type="radio"
        id={value}
        name="proposalVoteChoice"
        readOnly={!onClick}
        onChange={onClick}
        disabled={votingComplete}
        value={value}
        checked={checked}
      />
      <label
        className={classNames(styles.radioLabel, styles[value])}
        htmlFor={value}
      />
      {description}
    </div>
  )
);

const UpdateVoteChoiceModalButton = ({
  onSubmit,
  newVoteChoice,
  eligibleTicketCount,
  votedSuccessfully
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
    disabled={!newVoteChoice || votedSuccessfully}
    onSubmit={onSubmit}
    className={styles.overviewVotingButton}
    buttonLabel={
      <T id="proposals.updateVoteChoiceModal.btnLabel" m="Cast Vote" />
    }
  />
);

const ChooseOptions = React.memo(
  ({
    currentVoteChoice,
    eligibleTicketCount,
    newVoteChoice,
    voteOptions,
    votingComplete,
    onVoteSubmit,
    setVoteOption,
    votedSuccessfully
  }) => (
    <>
      <div className={styles.votingPreference}>
        <div className={styles.preferenceTitle}>
          <T
            id="proposalDetails.votingInfo.votingPreferenceTitle"
            m="My Voting Preference"
          />
        </div>
        <div>
          {voteOptions.map((o) => (
            <VoteOption
              value={o.id}
              key={o.id}
              votingComplete={votingComplete}
              description={o.id.charAt(0).toUpperCase() + o.id.slice(1)}
              onClick={() =>
                currentVoteChoice === "abstain" && setVoteOption(o.id)
              }
              checked={
                newVoteChoice
                  ? newVoteChoice === o.id
                  : currentVoteChoice !== "abstain"
                  ? currentVoteChoice.id === o.id
                  : false
              }
            />
          ))}
        </div>
      </div>
      {!votingComplete && (
        <UpdateVoteChoiceModalButton
          {...{
            newVoteChoice,
            onSubmit: onVoteSubmit,
            eligibleTicketCount,
            votedSuccessfully
          }}
        />
      )}
    </>
  )
);

export default ChooseOptions;
