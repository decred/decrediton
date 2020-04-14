import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { AddMixerAccountsModal } from "modals";
import { WatchOnlyWarnNotification, Subtitle } from "shared";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import { useState, useEffect } from "react";

function ConfigMixer({
  isCreateAccountDisabled, accounts
}) {
  const [areAccountsAvailable, setAreAvailable] = useState(null);

  const checkAvailableAccounts = () => {
    console.log(accounts)
    console.log(MIXED_ACCOUNT)
    const mixedExists = accounts.find(({ accountName }) => accountName === MIXED_ACCOUNT);
    const changeExists = accounts.find(({ accountName }) => accountName === CHANGE_ACCOUNT);

    return !mixedExists && !changeExists;
  }
  useEffect(() => setAreAvailable(checkAvailableAccounts()), []);


  return (
    <>
      <Subtitle title={<T id="privacy.subtitle" m="Privacy" />} />
      <div className="privacy-page-wrapper is-column">
        {
          areAccountsAvailable ? (
            <div>
              <T id="privacy.create.default.title" m="Create Default Accounts" />
              <T id="privacy.create.default.description"
                m={`If continue the accounts {mixed} and {change} are going to be created.
                  Which are the default ones for the mixer. {boldMessage}`}
                values={{
                  mixed: MIXED_ACCOUNT,
                  change: CHANGE_ACCOUNT,
                  boldMessage:
                    <span className="bold">
                      <T id="privacy.create.undone.message" m="This action can not be undone" />
                    </span>
                }}
              />
            </div>
          ) : (
              <>
                <div>
                  <T id="privacy.create.accounts" m="Create Needed Accounts" />
                </div>
                <div>

                  <T id="privacy.create.needed.description"
                    m={`It looks like you already have one of the default accounts: {mixed} and {change}.
                    You will need to create 2 new accounts for using the mixer. {boldMessage}`}
                    values={{
                      mixed: MIXED_ACCOUNT,
                      change: CHANGE_ACCOUNT,
                      boldMessage:
                        <span className="bold">
                          <T id="privacy.create.undone.message" m="This action can not be undone" />
                        </span>
                    }}
                  />
                </div>
                <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
                  <PassphraseModalButton
                    disabled={isCreateAccountDisabled}
                    modalTitle={<T id="accounts.newAccountConfirmations" m="Create needed accounts" />}
                    modalComponent={AddMixerAccountsModal}
                    buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
                  />
                </WatchOnlyWarnNotification>
              </>
            )
        }
      </div>
    </>
  )
}

export default ConfigMixer;
