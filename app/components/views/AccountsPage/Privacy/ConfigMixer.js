import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { AddMixerAccountsModal } from "modals";
import { WatchOnlyWarnNotification } from "shared";
import { useState } from "react";

function ConfigMixer({
  isCreateAccountDisabled,
}) {
  const [ show, toggleShow ] = useState(false);
  return (
    <div className="privacy-page-wrapper is-column">
      <T id="privacy.create.accounts" m="Create Needed Accounts"/>
      <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
        <PassphraseModalButton
          disabled={isCreateAccountDisabled}
          modalTitle={<T id="accounts.newAccountConfirmations" m="Create new account" />}
          modalComponent={AddMixerAccountsModal}
          buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
        />
      </WatchOnlyWarnNotification>
    </div>
  );
}

export default ConfigMixer;
