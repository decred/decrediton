import { FormattedMessage as T, defineMessages } from "react-intl";
import { StandaloneHeader } from "layout";
import { ReceiveAccountsSelect, PathBrowseInput } from "inputs";
import { TextToggle, PiUiInfoDocModalButton } from "buttons";
import styles from "./CreateLNWallet.module.css";
import { LN_ICON } from "constants";
import { AnimatedContainer } from "shared";
import { classNames } from "pi-ui";

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

const messages = defineMessages({
  backupFilePlaceholder: {
    id: "ln.connectPage.backupFilePlaceholder",
    defaultMessage: "Select a path..."
  },
  backupFileLabel: {
    id: "ln.connectPage.backupFile",
    defaultMessage: "Restore SCB backup"
  }
});

export const CreateLNWalletHeader = () => (
  <StandaloneHeader
    title={<T id="ln.createLNWalletPage.title" m="Lightning Transactions" />}
    description={
      <T
        id="ln.createLNWalletPage.description"
        m={"Start, unlock and connect to the dcrlnd wallet."}
      />
    }
    iconType={LN_ICON}
  />
);

const CreateLNWallet = ({
  account,
  accountOption,
  scbFile,
  setScbFile,
  onChangeAccount,
  onAccountOptionClick,
  intl
}) => {
  return (
    <>
      <div className={styles.accountSelection}>
        <div>
          <TextToggle
            leftText={
              <T
                id="ln.connectPage.createAccount"
                m="Create New Wallet account"
              />
            }
            rightText={
              <T
                id="ln.connectPage.useAccount"
                m="Use Existing Wallet Account"
              />
            }
            activeButton={accountOption}
            toggleAction={onAccountOptionClick}
            className={styles.textToggle}
            childClassName={styles.textToggleChild}
          />
        </div>
      </div>
      <AnimatedContainer show={accountOption !== NEW_ACCOUNT}>
        <div className={styles.connectOptWrapper}>
          <div className={styles.connectOpt}>
            <ReceiveAccountsSelect
              selectWithBigFont
              className={styles.receiveSelectAccountSelect}
              selectClassName={styles.receiveSelectAccountSelectInput}
              account={account.value}
              onChange={onChangeAccount}
              showAccountsButton={false}
              hideSpendable={false}
            />
            <div className={styles.existingAccountWarning}>
              <strong>
                <T
                  id="ln.connectPage.useExistingAccountWarningAttention"
                  m={"Attention: "}
                />
              </strong>
              <T
                id="ln.connectPage.useExistingAccountWarning"
                m={`note that a running LN wallet maintains unencrypted keys
in memory while it's running and also takes control of all funds of the
given account. It's recommended to have an account dedicated to LN
operations and only transfer the funds you intend to use in LN to it.`}
              />
            </div>
          </div>
        </div>
      </AnimatedContainer>
      <div className={styles.connectOptWrapper}>
        <div className={classNames(styles.connectOpt, styles.fileInputOpt)}>
          <div className={styles.fileInput}>
            <PathBrowseInput
              id="fileInput"
              newBiggerFontStyle
              open
              type="file"
              label={intl.formatMessage(messages.backupFileLabel)}
              placeholder={intl.formatMessage(messages.backupFilePlaceholder)}
              value={scbFile}
              onChange={(value) => setScbFile(value)}
              className={styles.pathBrowseInput}
            />
            <PiUiInfoDocModalButton document="LNBackupInfo" double draggable />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLNWallet;
