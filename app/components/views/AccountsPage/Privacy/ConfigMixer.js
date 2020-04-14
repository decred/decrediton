import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { AddMixerAccountsModal } from "modals";
import { WatchOnlyWarnNotification } from "shared";
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

  console.log(areAccountsAvailable)
  return areAccountsAvailable ? (
    <div>
      Create default accounts
    </div>
  ) : (
      <div className="privacy-page-wrapper is-column">
        <T id="privacy.create.accounts" m="Create Needed Accounts" />
        <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
          <PassphraseModalButton
            disabled={isCreateAccountDisabled}
            modalTitle={<T id="accounts.newAccountConfirmations" m="Create needed accounts" />}
            modalComponent={AddMixerAccountsModal}
            buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
          />
        </WatchOnlyWarnNotification>
      </div>
    );
}

export default ConfigMixer;
