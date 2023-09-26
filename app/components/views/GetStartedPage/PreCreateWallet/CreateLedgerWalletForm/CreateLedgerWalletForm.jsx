import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, InvisibleButton } from "buttons";
import styles from "./CreateLedgerWalletForm.module.css";
import { Documentation } from "shared";

const messages = defineMessages({
  walletNameInputPlaceholder: {
    id: "createLedgerWallet.walletNameInput.placeholder",
    defaultMessage: "Choose a name for your Ledger Wallet"
  },
  walletNameInputLabel: {
    id: "createLedgerWallet.walletNameInput.label",
    defaultMessage: "Wallet Name"
  },
  messageWalletDupeNameError: {
    id: "createLedgerWallet.dupeWalletName.error",
    defaultMessage: "Please choose an unused wallet name"
  }
});

const CreateLedgerWalletForm = ({
  createWallet,
  hideCreateWalletForm,
  newWalletName,
  walletNameError,
  onChangeCreateWalletName,
  hasFailedAttemptName,
  intl
}) => (
  <div className={styles.container}>
    <div className={styles.title}>
      <T
        id="createLedgerWallet.title"
        m="Create a Ledger-backed Decrediton Wallet"
      />
    </div>
    <div className={styles.grid}>
      <Documentation name="PreCreateLedgerWallet1" />
      <Documentation name="PreCreateLedgerWallet2" />
      <T id="createLedgerWallet.createAWallet" m="Create a Wallet" />
    </div>

    <div>
      <TextInput
        newBiggerFontStyle
        id="walletNameInput"
        required
        invalid={walletNameError}
        invalidMessage={intl.formatMessage(messages.messageWalletDupeNameError)}
        value={newWalletName}
        onChange={(e) => onChangeCreateWalletName(e.target.value)}
        label={intl.formatMessage(messages.walletNameInputLabel)}
        placeholder={intl.formatMessage(messages.walletNameInputPlaceholder)}
        showErrors={hasFailedAttemptName}
        className={styles.walletNameInput}
      />

      <div className={styles.buttonContrainer}>
        <InvisibleButton
          onClick={hideCreateWalletForm}
          className={styles.cancelBt}>
          <T id="createLedgerWallet.cancel" m="Cancel" />
        </InvisibleButton>
        <KeyBlueButton
          onClick={createWallet}
          classNames={styles.createWalletBt}>
          <T id="createLedgerWallet.createWallet" m="Create Wallet" />
        </KeyBlueButton>
      </div>
    </div>
  </div>
);

export default CreateLedgerWalletForm;
