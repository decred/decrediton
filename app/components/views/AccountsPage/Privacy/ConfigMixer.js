import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { AddMixerAccountsModal } from "modals";
import { WatchOnlyWarnNotification, Subtitle } from "shared";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as amc from "actions/AccountMixerActions";

function ConfigMixer({ isCreateAccountDisabled, accounts }) {
  const dispatch = useDispatch();
  const [areAccountsAvailable, setAreAvailable] = useState(null);

  const checkAvailableAccounts = useCallback(() => {
    const mixedExists = accounts.find(
      ({ accountName }) => accountName === MIXED_ACCOUNT
    );
    const changeExists = accounts.find(
      ({ accountName }) => accountName === CHANGE_ACCOUNT
    );

    return !mixedExists && !changeExists;
  }, [accounts]);
  const [mixedAccountName, setMixedAccountName] = useState("");
  const [changeAccountName, setChangeAccountName] = useState("");
  const isValid = () => !(!mixedAccountName || !changeAccountName);
  const onSubmit = (passphrase) => {
    dispatch(
      amc.createNeededAccounts(passphrase, mixedAccountName, changeAccountName)
    );
  };

  useEffect(() => {
    if (checkAvailableAccounts()) {
      setAreAvailable(true);
      setMixedAccountName(MIXED_ACCOUNT);
      setChangeAccountName(CHANGE_ACCOUNT);
    }
  }, [checkAvailableAccounts]);

  return (
    <>
      <Subtitle
        title={<T id="privacy.config.subtitle" m="Privacy Configuration" />}
      />
      <div className="privacy-page-wrapper is-column">
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
                  <span className="bold">
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
                    <span className="bold">
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
}

export default ConfigMixer;
