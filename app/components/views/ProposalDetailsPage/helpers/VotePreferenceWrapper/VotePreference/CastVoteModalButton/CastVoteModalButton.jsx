import { PassphraseModalButton } from "buttons";
import styles from "./CastVoteModalButton.module.css";

const CastVoteModalButton = ({
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

export default CastVoteModalButton;
