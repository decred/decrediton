import {
  InfoDocFieldModalButton,
  KeyBlueButton,
  InvisibleButton
} from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import {
  ConfirmSeedMsg,
  BackBtnMsg,
  CreateWalletMsg,
  GoBackMsg,
  CreateNewWalletTitle
} from "../../messages";
import { Tooltip, CreatePassPhrase } from "shared";
import { classNames } from "pi-ui";
import styles from "../CreateWallet.module.css";

export const ConfirmSeedForm = ({
  seedWords,
  onChangeSeedWord,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  isCreatingWallet
}) => (
  <div className={styles.createWalletWrapper}>
    <div className={classNames(styles.contentTitleWrapper, "is-row")}>
      <div className={styles.contentTitle}>
        <CreateNewWalletTitle />
      </div>
      {sendBack && (
        <Tooltip text={<GoBackMsg />}>
          <div className={styles.goBackScreenButton} onClick={sendBack} />
        </Tooltip>
      )}
    </div>
    <div className={classNames(styles.seed, "is-row")}>
      <div
        className={classNames(styles.confirmSeedLabel, styles.seed, "is-row")}>
        <InfoDocFieldModalButton document="SeedInfo" />
        <div className={styles.infoLabel}>
          <ConfirmSeedMsg />
        </div>
      </div>
      <div className={styles.seedArea}>
        {seedWords.map((seedWord) => {
          return (
            <div
              key={`seeditem-${seedWord.index}`}
              className={classNames(
                styles.seedWord,
                seedWord.show && styles.filled,
                !seedWord.show &&
                  seedWord.word !== "" &&
                  seedWord.match &&
                  styles.match,
                !seedWord.show &&
                  seedWord.word !== "" &&
                  !seedWord.match &&
                  styles.noMatch,
                !seedWord.show && seedWord.word === "" && styles.empty
              )}>
              <span className={styles.number}>{seedWord.index + 1}.</span>
              <span className={styles.word}>
                {seedWord.show ? (
                  seedWord.word
                ) : (
                  <SingleSeedWordEntry
                    disabled={seedWord.show}
                    onChange={onChangeSeedWord}
                    seedWord={seedWord}
                    className="Select-menu-with-arrow" // this gonna change when moving to pi-ui's Select
                    value={{ name: seedWord.word }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <div className={styles.createWalletButtonContainer}>
      <KeyBlueButton
        className={styles.walletKeyBlueButton}
        disabled={!isValid}
        loading={isCreatingWallet}
        onClick={onCreateWallet}>
        <CreateWalletMsg />
      </KeyBlueButton>
      <InvisibleButton className={styles.goBackButton} onClick={sendBack}>
        <BackBtnMsg />
      </InvisibleButton>
    </div>
  </div>
);

export default ConfirmSeedForm;
