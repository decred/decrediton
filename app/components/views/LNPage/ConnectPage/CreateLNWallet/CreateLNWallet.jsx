import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { ReceiveAccountsSelect, PathBrowseInput } from "inputs";
import { TextToggle, InfoDocModalButton } from "buttons";
import styles from "./CreateLNWallet.module.css";
import { LN_ICON } from "constants";
import { AnimatedContainer } from "shared";

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

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
  onAccountOptionClick
}) => {
  return (
    <>
      <div className={styles.accountSelection}>
        <div>
          <TextToggle
            leftText={<T id="ln.connectPage.createAccount" m="Create new" />}
            rightText={<T id="ln.connectPage.useAccount" m="Use existing" />}
            activeButton={accountOption}
            toggleAction={onAccountOptionClick}
          />
        </div>
      </div>
      <AnimatedContainer show={accountOption !== NEW_ACCOUNT}>
        <div className={styles.connectOptWrapper}>
          <div className={styles.connectOpt}>
            <ReceiveAccountsSelect
              account={account.value}
              onChange={onChangeAccount}
              showAccountsButton={false}
              hideSpendable={false}
            />
            <div className={styles.existingAccountWarning}>
              <T
                id="ln.connectPage.useExistingAccountWarning"
                m={`Attention: note that a running LN wallet maintains unencrypted keys
in memory while it's running and also takes control of all funds of the
given account. It's recommended to have an account dedicated to LN
operations and only transfer the funds you intend to use in LN to it.`}
              />
            </div>
          </div>
        </div>
      </AnimatedContainer>
      <div className={styles.connectOptWrapper}>
        <div className={styles.connectOpt}>
          <div className={styles.label}>
            <T id="ln.connectPage.backupFile" m="Restore SCB backup" />
          </div>
          <div className={styles.fileInput}>
            <PathBrowseInput
              id="fileInput"
              open
              type="file"
              value={scbFile}
              onChange={(value) => setScbFile(value)}
            />
          </div>

          <InfoDocModalButton document="LNBackupInfo" double draggable />
        </div>
      </div>
    </>
  );
};

export default CreateLNWallet;
