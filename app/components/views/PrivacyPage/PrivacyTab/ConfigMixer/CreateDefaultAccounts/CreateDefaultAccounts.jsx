import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { WatchOnlyWarnNotification } from "shared";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import styles from "./CreateDefaultAccounts.module.css";

const CreateDefaultAccounts = ({
  onSubmit,
  mixedAccountName,
  changeAccountName,
  setMixedAccountName,
  setChangeAccountName,
  isValid,
  isCreateAccountDisabled,
  createMixerAccountAttempt
}) => (
  <div>
    <T
      id="privacy.create.default.description"
      m="Do you wish to create default mixing accounts {mixed} and {change}? {boldMessage}"
      values={{
        mixed: MIXED_ACCOUNT,
        change: CHANGE_ACCOUNT,
        boldMessage: (
          <span className={styles.bold}>
            <T
              id="privacy.create.default.undone.message"
              m="This action can not be undone"
            />
          </span>
        )
      }}
    />
    <div className="margin-top-m">
      <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
        <PassphraseModalButton
          {...{
            onSubmit,
            mixedAccountName,
            changeAccountName,
            setMixedAccountName,
            setChangeAccountName,
            isValid
          }}
          loading={createMixerAccountAttempt}
          isDisabled={isCreateAccountDisabled || createMixerAccountAttempt}
          modalTitle={
            <T
              id="accounts.defaultAccountConfirmations"
              m="Create default accounts"
            />
          }
          buttonLabel={
            <T id="accounts.createDefaultAcc" m="Create default Accounts" />
          }
        />
      </WatchOnlyWarnNotification>
    </div>
  </div>
);

export default CreateDefaultAccounts;
