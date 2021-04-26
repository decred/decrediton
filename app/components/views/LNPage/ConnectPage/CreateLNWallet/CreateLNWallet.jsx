import { spring } from "react-motion";
import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { ReceiveAccountsSelect, PathBrowseInput } from "inputs";
import { TextToggle, InfoDocModalButton } from "buttons";
import { TransitionMotionWrapper } from "shared";
import styles from "./CreateLNWallet.module.css";
import { LN_ICON } from "constants";

const AccountsListComponent = ({ account, onChangeAccount }) => (
  <>
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
  </>
);

const nullStyles = [
  {
    data: null,
    key: "output_0",
    style: {
      height: spring(0, { stiffness: 100, damping: 14 }),
      opacity: spring(0, { stiffness: 100, damping: 20 })
    }
  }
];

const getAccountsListComponent = (accountsListComponent) => [
  {
    data: accountsListComponent,
    key: "output_0",
    style: {
      height: spring(140, { stiffness: 100, damping: 14 }),
      opacity: spring(1, { stiffness: 100, damping: 20 })
    }
  }
];

const wrapperComponent = (props) => (
  <div className={styles.accountList} {...props} />
);

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

export const CreateLNWalletHeader = () => (
  <StandaloneHeader
    title={<T id="ln.createLNWalletPage.title" m="Create Lightning Wallet" />}
    description={
      <T
        id="ln.createLNWalletPage.description"
        m={
          "Create a new Lightning Network wallet backed by the Decrediton wallet."
        }
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
}) => (
  <>
    <div className={styles.connectOpt}>
      <div className={styles.label}>
        <T id="ln.connectPage.account" m="Wallet account to use" />
      </div>
      <div className={styles.accountSelection}>
        <div>
          <TextToggle
            leftText={<T id="ln.connectPage.createAccount" m="Create new" />}
            rightText={<T id="ln.connectPage.useAccount" m="Use existing" />}
            activeButton={accountOption}
            toggleAction={onAccountOptionClick}
          />
        </div>
        <TransitionMotionWrapper
          styles={
            accountOption === NEW_ACCOUNT
              ? nullStyles
              : getAccountsListComponent(
                  <AccountsListComponent
                    account={account}
                    onChangeAccount={onChangeAccount}
                  />
                )
          }
          wrapperComponent={wrapperComponent}
        />
      </div>
    </div>
    <div className={styles.connectOpt}>
      <div className={styles.label}>
        <T id="ln.connectPage.backupFile" m="Restore SCB backup" />
      </div>
      <div className={styles.fileInput}>
        <PathBrowseInput
          open
          type="file"
          value={scbFile}
          onChange={(value) => setScbFile(value)}
        />
      </div>

      <InfoDocModalButton document="LNBackupInfo" double draggable />
    </div>
  </>
);

export default CreateLNWallet;
