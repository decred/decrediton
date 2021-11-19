import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { WatchOnlyWarnNotification } from "shared";
import { AddMixerAccountsModal } from "modals";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import styles from "./CreateNeededAccounts.module.css";

const CreateNeededAccounts = ({
  onSubmit,
  mixedAccountName,
  changeAccountName,
  setMixedAccountName,
  setChangeAccountName,
  isValid,
  isCreateAccountDisabled,
  createMixerAccountAttempt
}) => (
  <>
    <div>
      <T
        id="privacy.create.needed.description"
        m={`It looks like you already have one of the default accounts: {mixed} and {change}.
          You will need to create 2 new accounts for using the mixer. {boldMessage}`}
        values={{
          mixed: MIXED_ACCOUNT,
          change: CHANGE_ACCOUNT,
          boldMessage: (
            <span className={styles.bold}>
              <T
                id="privacy.create.needed.undone.message"
                m="This action can not be undone"
              />
            </span>
          )
        }}
      />
    </div>
    <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
      <PassphraseModalButton
        {...{
          onSubmit,
          mixedAccountName,
          changeAccountName,
          setMixedAccountName,
          setChangeAccountName,
          parentIsValid: isValid
        }}
        loading={createMixerAccountAttempt}
        disabled={isCreateAccountDisabled || createMixerAccountAttempt}
        modalTitle={
          <T id="accounts.createNeededAcc" m="Create Needed Accounts" />
        }
        modalComponent={AddMixerAccountsModal}
        buttonLabel={
          <T id="accounts.createNeededAcc" m="Create Needed Accounts" />
        }
      />
    </WatchOnlyWarnNotification>
  </>
);

export default CreateNeededAccounts;
