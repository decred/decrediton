import { classNames, Icon } from "pi-ui";
import { CreatePassPhrase } from "shared";
import { CreateWalletMsg, BackMsg } from "../../../messages";
import { ButtonsBar, SeedError } from "../../helpers";
import styles from "./ConfirmSeedForm.module.css";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import SeedWordRow from "./SeedWordRow";

export const ConfirmSeedForm = ({
  seedWords,
  onSeedButtonClick,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  posBtBarToBottom,
  error,
  allWordsHaveBeenSelected,
  topError
}) => (
  <div
    className={classNames(
      styles.container,
      posBtBarToBottom && styles.posBtBarToBottom
    )}>
    <div className={styles.title}>
      <T id="confirmSeed.title" m="Seed phrase verification" />
    </div>
    <div className={styles.desc}>
      <T
        id="confirmSeed.desc"
        m="Each field contains only one correct word.
        Please, confirm your seed by selecting the correct word in each row."
      />
    </div>
    {topError && (
      <SeedError className={styles.topError}>
        <Icon
          type="alert"
          backgroundColor="#ed6d47"
          iconColor="#feb8a5"
          size="lg"
        />
        {topError}
      </SeedError>
    )}
    <div>
      {seedWords.map(({ word, wordsToShow, selected }, index) => (
        <SeedWordRow
          {...{
            word,
            wordsToShow,
            selected,
            index,
            onSeedButtonClick,
            showError: allWordsHaveBeenSelected
          }}
          key={`word-${index}`}
        />
      ))}
    </div>
    {error && <SeedError>{error}</SeedError>}
    <Documentation name="PassphraseInfo" className={styles.passphraseInfo} />
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <div className={styles.buttonBarContainer}>
      <ButtonsBar
        disabled={!isValid}
        message={<CreateWalletMsg />}
        backMessage={<BackMsg />}
        onClick={onCreateWallet}
        onBackClick={sendBack}
        className={styles.buttonBar}
        primaryButtonClassName={styles.primaryButton}
        backButtonClassName={styles.backButton}
      />
    </div>
  </div>
);

ConfirmSeedForm.propTypes = {
  seedWords: PropTypes.array.isRequired,
  onSeedButtonClick: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  onCreateWallet: PropTypes.func.isRequired,
  sendBack: PropTypes.func.isRequired,
  setPassPhrase: PropTypes.func.isRequired,
  posBtBarToBottom: PropTypes.bool.isRequired,
  error: PropTypes.string,
  allWordsHaveBeenSelected: PropTypes.bool.isRequired,
  topError: PropTypes.string
};

export default ConfirmSeedForm;
