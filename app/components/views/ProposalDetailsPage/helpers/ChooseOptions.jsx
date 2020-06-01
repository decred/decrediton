import React from "react";
import { FormattedMessage as T } from "react-intl";
import { RadioButtonGroup } from "pi-ui";
import styles from "../ProposalDetails.module.css";
import { PassphraseModalButton } from "buttons";

// const VoteOption = React.memo(
//   ({ value, description, onClick, checked, votingComplete }) => (
//     <div className={styles.voteOption}>
//       <input
//         className={styles[value]}
//         type="radio"
//         id={value}
//         name="proposalVoteChoice"
//         readOnly={!onClick}
//         onChange={onClick}
//         disabled={votingComplete}
//         value={value}
//         checked={checked}
//       />
//       <label
//         className={classNames(styles.radioLabel, styles[value])}
//         htmlFor={value}
//       />
//       {description}
//     </div>
//   )
// );

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
        <div className={styles.radioButtonsWrapper}>
          <RadioButtonGroup
            options={voteOptions.map((o) => ({
              label: o.id.charAt(0).toUpperCase() + o.id.slice(1),
              value: o.id
            }))}
            onChange={(option) => setVoteOption(option.value)}
            value={newVoteChoice || currentVoteChoice.id}
            vertical
            disabled={votingComplete}
          />
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
