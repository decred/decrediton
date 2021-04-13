import { classNames, Tooltip } from "pi-ui";
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
import { CreatePassPhrase } from "shared";
import styles from "../CreateWallet.module.css";
import { Container, TitleWrapper } from "../helpers";

export const ConfirmSeedForm = ({
  seedWords,
  onChangeSeedWord,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  isCreatingWallet
}) => (
  <Container>
    <TitleWrapper title={<CreateNewWalletTitle />}>
      {sendBack && (
        <Tooltip content={<GoBackMsg />}>
          <div className={styles.goBackScreenButton} onClick={sendBack} />
        </Tooltip>
      )}
    </TitleWrapper>
    <div className={classNames(styles.seed, "flex-row")}>
      <div
        className={classNames(
          styles.confirmSeedLabel,
          styles.seed,
          "flex-row"
        )}>
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
  </Container>
);

export default ConfirmSeedForm;
