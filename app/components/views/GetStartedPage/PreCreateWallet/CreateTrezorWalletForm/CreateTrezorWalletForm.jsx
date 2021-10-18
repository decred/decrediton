import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, InvisibleButton, TextToggle } from "buttons";
import styles from "./CreateTrezorWalletForm.module.css";
import { Documentation } from "shared";
import { useCreateTrezorWalletForm, CREATE_WALLET } from "./hooks.js";
import TrezorPageContent from "views/TrezorPage/TrezorPageContent";
import TrezorPageAccordion from "views/TrezorPage/TrezorPageAccordion";

const messages = defineMessages({
  walletNameInputPlaceholder: {
    id: "createTrezorWallet.walletNameInput.placeholder",
    defaultMessage: "Choose a name for your Trezor Wallet"
  },
  walletNameInputLabel: {
    id: "createTrezorWallet.walletNameInput.label",
    defaultMessage: "Wallet Name"
  },
  messageWalletDupeNameError: {
    id: "createTrezorWallet.dupeWalletName.error",
    defaultMessage: "Please choose an unused wallet name"
  }
});

const CreateTrezorWalletForm = ({
  createWallet,
  hideCreateWalletForm,
  newWalletName,
  walletNameError,
  onChangeCreateWalletName,
  hasFailedAttemptName,
  intl
}) => {
  const { toggleState, onToggleStateClick } = useCreateTrezorWalletForm();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <T
          id="createTrezorWallet.title"
          m="Create a Trezor-backed Decrediton Wallet"
        />
      </div>
      <div className={styles.grid}>
        <Documentation name="PreCreateTrezorWallet1" />
        <Documentation name="PreCreateTrezorWallet2" />
        <TextToggle
          leftText={
            <T id="createTrezorWallet.createAWallet" m="Create a Wallet" />
          }
          rightText={
            <T id="createTrezorWallet.deviceSetup" m=" Device Setup" />
          }
          activeButton={toggleState}
          toggleAction={onToggleStateClick}
          className={styles.textToggle}
          childClassName={styles.textToggleChild}
        />
      </div>

      {toggleState === CREATE_WALLET ? (
        <div>
          <TextInput
            newBiggerFontStyle
            id="walletNameInput"
            required
            invalid={walletNameError}
            invalidMessage={intl.formatMessage(
              messages.messageWalletDupeNameError
            )}
            value={newWalletName}
            onChange={(e) => onChangeCreateWalletName(e.target.value)}
            label={intl.formatMessage(messages.walletNameInputLabel)}
            placeholder={intl.formatMessage(
              messages.walletNameInputPlaceholder
            )}
            showErrors={hasFailedAttemptName}
            className={styles.walletNameInput}
          />

          <div className={styles.buttonContrainer}>
            <InvisibleButton
              onClick={hideCreateWalletForm}
              className={styles.cancelBt}>
              <T id="createTrezorWallet.cancel" m="Cancel" />
            </InvisibleButton>
            <KeyBlueButton
              onClick={createWallet}
              classNames={styles.createWalletBt}>
              <T id="createTrezorWallet.createWallet" m="Create Wallet" />
            </KeyBlueButton>
          </div>
        </div>
      ) : (
        <div>
          <TrezorPageContent ContainerComponent={TrezorPageAccordion} />
        </div>
      )}
    </div>
  );
};

export default CreateTrezorWalletForm;
