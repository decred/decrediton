import { FormattedMessage as T } from "react-intl";
import { useState } from "react";
import { useDex } from "../hooks";
import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { AddAccountModal } from "modals";
import styles from "./CreateDexAcctPage.module.css";
import { classNames } from "pi-ui";
import { AccountsSelect } from "inputs";

const CreateDexAcctPage = () => {
  const [account, setAccount] = useState(null);
  const {
    onCreateDexAccount,
    dexAccountAttempt,
    dexSelectAccountAttempt,
    onSelectDexAccount,
    mixedAccount
  } = useDex();

  return (
    <>
      <div className={styles.dexContent}>
        <T
          id="dex.newAccount"
          m="Please create a new or select an existing account that will be connected to the DEX.  Transfer funds in and out of this account to deposit/withdrawal funds from what is accessible at the DEX."
        />
        <div className={classNames(styles.buttons, "margin-top-m")}>
          <PassphraseModalButton
            disabled={dexAccountAttempt || dexSelectAccountAttempt}
            modalTitle={<T id="dex.createDexAccount" m="Create DEX Account" />}
            loading={dexAccountAttempt}
            modalComponent={AddAccountModal}
            onSubmit={onCreateDexAccount}
            buttonLabel={
              <T id="dex.createDexAccountButton" m="Create DEX Account" />
            }
          />
          <label htmlFor="accountSelect" className={styles.accountSelectLabel}>
            <T id="dex.createDexAccount.or" m="or" />
          </label>
          <AccountsSelect
            isDisabled={dexAccountAttempt || dexSelectAccountAttempt}
            id="accountSelect"
            {...{ account, onChange: setAccount }}
            filterAccounts={[mixedAccount]}
            className={styles.accountSelect}
          />
          <KeyBlueButton
            disabled={dexAccountAttempt || dexSelectAccountAttempt || !account}
            loading={dexSelectAccountAttempt}
            onClick={() => onSelectDexAccount(account.name)}>
            <T
              id="dex.createDexAccount.selectAnExistingAccount"
              m="Select an existing account"
            />
          </KeyBlueButton>
        </div>
      </div>
    </>
  );
};

export default CreateDexAcctPage;
