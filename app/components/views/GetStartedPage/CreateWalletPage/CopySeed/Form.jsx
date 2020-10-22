import { SeedCopyConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackBtnMsg, GoBackMsg, CreateNewWalletTitle } from "../../messages";
import { Tooltip } from "shared";
import { classNames } from "pi-ui";
import styles from "../CreateWallet.module.css";

const CopySeedPage = ({
  showCopySeedConfirm,
  toggleCopySeed,
  onSubmitCopySeedConfirm,
  mnemonic,
  sendBack,
  sendContinue
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
    <Documentation
      name="WalletCreationWarning"
      className={styles.createWalletWarning}
    />
    <div className={styles.seedArea}>
      {mnemonic.split(" ").map((word, i) => {
        return (
          <div key={i} className={classNames(styles.seedWord, styles.filled)}>
            <span className={styles.number}>{i + 1}.</span>
            <span className={styles.word}>{word}</span>
          </div>
        );
      })}
      <div className={styles.copy} onClick={() => toggleCopySeed(true)}>
        <T id="createWallet.copy" m="Copy seed words to clipboard" />
      </div>
    </div>
    <div className={styles.toolbar}>
      <KeyBlueButton
        className={styles.walletKeyBlueButton}
        onClick={sendContinue}>
        <T id="createWallet.continueBtn" m="Continue" />
      </KeyBlueButton>
      <InvisibleButton className={styles.goBackButton} onClick={sendBack}>
        <BackBtnMsg />
      </InvisibleButton>
    </div>
    <SeedCopyConfirmModal
      show={showCopySeedConfirm}
      onSubmit={onSubmitCopySeedConfirm}
      onCancelModal={() => toggleCopySeed(false)}
    />
  </div>
);

export default CopySeedPage;
