import SingleSeedWordEntry from "../SingleSeedWordEntry";
import { SeedHexEntry } from "inputs";
import { TextToggle, KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import {
  ConfirmSeedMsg,
  BackBtnMsg,
  GoBackMsg,
  CreateWalletMsg
} from "../../messages";
import { WORDS, HEX } from "constants";
import { Tooltip, CreatePassPhrase } from "shared";
import { classNames } from "pi-ui";
import styles from "../CreateWallet.module.css";

const ExistingSeedForm = ({
  onChangeSeedWord,
  seedWords,
  handleOnPaste,
  hexSeed,
  isCreatingWallet,
  seedType,
  pasteFromClipboard,
  handleToggle,
  showPasteWarning,
  showPasteError,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  error
}) => (
  <div className={styles.createWalletWrapper}>
    <div className={classNames(styles.contentTitleWrapper, "is-row")}>
      <div className={styles.contentTitle}>
        <T id="createWallet.restore.title" m={"Restore existing wallet"} />
      </div>
      {/* XXX: Can we use here pi-iu's toggle? */}
      <TextToggle
        activeButton={"left"}
        leftText={WORDS}
        rightText={HEX}
        toggleAction={handleToggle}
      />
      {sendBack && (
        <Tooltip text={<GoBackMsg />}>
          <div className={styles.goBackScreenButton} onClick={sendBack} />
        </Tooltip>
      )}
    </div>
    <div className={classNames("is-row", styles.seed)}>
      <div className={classNames(styles.confirmSeedLabel, styles.seed)}>
        <ConfirmSeedMsg />
      </div>
      {seedType === WORDS && Array.isArray(seedWords) ? (
        <div className={styles.seedArea}>
          {seedWords.map((seedWord, index) => (
            <div
              key={index}
              className={classNames(
                styles.seedWord,
                seedWord.word && seedWord.error && styles.error,
                seedWord.word && !seedWord.error && styles.populated,
                !seedWord.word && !seedWord.error && styles.restore
              )}>
              <span className={styles.number}>{index + 1}.</span>
              <span className={styles.word}>
                <SingleSeedWordEntry
                  onChange={onChangeSeedWord}
                  onPaste={handleOnPaste}
                  seedWord={seedWord}
                  value={{ name: seedWord.word }}
                  key={index}
                  className="Select-menu-with-arrow" // this gonna change when moving to pi-ui's Select
                  onPasteFromClipboard={pasteFromClipboard}
                />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={classNames(styles.seedArea, styles.hex)}>
          <SeedHexEntry
            onChange={(e) => onChangeSeedWord(e.target.value)}
            seed={hexSeed}
          />
        </div>
      )}
    </div>
    {showPasteError && (
      <div className={styles.seedError}>
        <T
          id="confirmSeed.warnings.pasteExistingError"
          m="* Please paste a valid 33 word seed."
        />
      </div>
    )}
    {showPasteWarning && (
      <div className={styles.seedError}>
        <T
          id="confirmSeed.warnings.pasteExistingSeed"
          m="*Please make sure you also have a physical, written down copy of your seed."
        />
      </div>
    )}
    {error && <div className={styles.seedWarning}>{error}</div>}
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

export default ExistingSeedForm;
