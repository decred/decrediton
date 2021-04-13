import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { SeedCopyConfirmModal } from "modals";
import { Documentation } from "shared";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackBtnMsg, GoBackMsg, CreateNewWalletTitle } from "../../messages";
import styles from "../CreateWallet.module.css";
import { Container, TitleWrapper } from "../helpers";

const CopySeedPage = ({
  showCopySeedConfirm,
  toggleCopySeed,
  onSubmitCopySeedConfirm,
  mnemonic,
  sendBack,
  sendContinue
}) => (
  <Container>
    <TitleWrapper title={<CreateNewWalletTitle />}>
      {sendBack && (
        <Tooltip content={<GoBackMsg />}>
          <div className={styles.goBackScreenButton} onClick={sendBack} />
        </Tooltip>
      )}
    </TitleWrapper>
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
  </Container>
);

export default CopySeedPage;
