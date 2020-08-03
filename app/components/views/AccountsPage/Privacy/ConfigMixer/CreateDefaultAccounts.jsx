

import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { WatchOnlyWarnNotification } from "shared";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import style from "../Privacy.module.css";

const CreateDefaultAccounts = ({
  onSubmit,
  mixedAccountName,
  changeAccountName,
  setMixedAccountName,
  setChangeAccountName,
  isValid,
  isCreateAccountDisabled
}) => (
  <div>
    <div>
      <T id="privacy.create.default.title" m="Create Default Accounts" />
    </div>
    <T
      id="privacy.create.default.description"
      m={`If continue the accounts {mixed} and {change} are going to be created.
          Which are the default ones for the mixer. {boldMessage}`}
      values={{
        mixed: MIXED_ACCOUNT,
        change: CHANGE_ACCOUNT,
        boldMessage: (
          <span className={style.bold}>
            <T
              id="privacy.create.default.undone.message"
              m="This action can not be undone"
            />
          </span>
        )
      }}
    />
    <div>
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
          disabled={isCreateAccountDisabled}
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
