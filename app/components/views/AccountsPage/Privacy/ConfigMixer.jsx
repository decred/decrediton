import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { AddMixerAccountsModal } from "modals";
import { WatchOnlyWarnNotification, Subtitle } from "shared";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import { classNames } from "pi-ui";
import style from "./Privacy.module.css";
import { useConfigMixer } from "./hooks";

const ConfigMixer = ({ isCreateAccountDisabled, accounts }) => {
  const {
    areAccountsAvailable,
    mixedAccountName,
    setMixedAccountName,
    changeAccountName,
    setChangeAccountName,
    onSubmit,
    isValid
  } = useConfigMixer(accounts);

  return (
    <>
      <Subtitle
        title={<T id="privacy.config.subtitle" m="Privacy Configuration" />}
      />
      <div className={classNames(style.pageWrapper, style.isColumn)}>
        {areAccountsAvailable ? (
          <div>
            <div>
              <T
                id="privacy.create.default.title"
                m="Create Default Accounts"
              />
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
                      id="privacy.create.undone.message"
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
                    <T
                      id="accounts.createDefaultAcc"
                      m="Create default Accounts"
                    />
                  }
                />
              </WatchOnlyWarnNotification>
            </div>
          </div>
        ) : (
            <>
              <div>
                <T id="privacy.create.accounts" m="Create Needed Accounts" />
              </div>
              <div>
                <T
                  id="privacy.create.needed.description"
                  m={`It looks like you already have one of the default accounts: {mixed} and {change}.
                    You will need to create 2 new accounts for using the mixer. {boldMessage}`}
                  values={{
                    mixed: MIXED_ACCOUNT,
                    change: CHANGE_ACCOUNT,
                    boldMessage: (
                      <span className={style.bold}>
                        <T
                          id="privacy.create.undone.message"
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
                    isValid
                  }}
                  disabled={isCreateAccountDisabled}
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
          )}
      </div>
    </>
  );
};

export default ConfigMixer;
