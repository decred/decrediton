import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import styles from "./CastVoteModalButton.module.css";

const CastVoteModalButton = ({ onSubmit, newVoteChoice, isLoading }) => (
  <PassphraseModalButton
    modalTitle={
      <>
        <T
          id="treasurySpending.updateVoteChoiceModal.title"
          m="Confirm Your Vote"
        />
        <div className={styles.voteConfirmation}>
          <div className={styles[`${newVoteChoice}Proposal`]} />
          {newVoteChoice}
        </div>
      </>
    }
    disabled={isLoading}
    loading={isLoading}
    onSubmit={onSubmit}
    className={styles.voteButton}
    buttonLabel={
      <T id="treasurySpending.updatePreference" m="Update Preference" />
    }
  />
);

export default CastVoteModalButton;
