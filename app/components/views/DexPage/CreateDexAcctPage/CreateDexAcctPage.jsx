import { FormattedMessage as T } from "react-intl";
import { useDex } from "../hooks";
import { PassphraseModalButton } from "buttons";
import { AddAccountModal } from "modals";
import styles from "./CreateDexAcctPage.module.css";

const CreateDexAcctPage = () => {
  const { onCreateDexAccount, dexAccountAttempt } = useDex();

  return (
    <>
      <div className={styles.dexContent}>
        <T
          id="dex.newAccount"
          m="Please create a new account that will be connected to the DEX.  Transfer funds in and out of this account to deposit/withdrawal funds from what is accessible at the DEX."
        />
      </div>
      <PassphraseModalButton
        className="margin-top-m"
        disabled={dexAccountAttempt}
        modalTitle={<T id="dex.createDexAccount" m="Create DEX Account" />}
        loading={dexAccountAttempt}
        modalComponent={AddAccountModal}
        onSubmit={onCreateDexAccount}
        buttonLabel={
          <T id="dex.createDexAccountButton" m="Create DEX Account" />
        }
      />
    </>
  );
};

export default CreateDexAcctPage;
