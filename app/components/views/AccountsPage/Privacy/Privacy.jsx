import PrivacyContent from "./Page";
import ConfigMixer from "./ConfigMixer";
import { usePrivacy } from "./hooks";

function validateErrorReducer(state, action) {
  switch (action.type) {
    case "ACCOUNT_MIXER_START":
      return {
        ...state,
        mixerStart: action.error
      };
  }
}

const Privacy = ({ isCreateAccountDisabled }) => {
  const {
    runAccountMixer,
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    csppServer,
    csppPort,
    mixedAccountBranch,
    accounts,
    error,
    dispatchError
  } = usePrivacy(validateErrorReducer);

  if (!mixedAccount && !changeAccount) {
    return <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />;
  }

  const getAccountName = (n) => {
    const account = accounts.find(({ accountNumber }) => accountNumber === n);
    return account ? account.accountName : null;
  };

  const mixedAccountName = getAccountName(mixedAccount);
  const changeAccountName = getAccountName(changeAccount);

  async function onStartMixerAttempt(passphrase) {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch,
      csppServer: `${csppServer}:${csppPort}`
    };
    try {
      await runAccountMixer(request);
    } catch (error) {
      dispatchError({ type: "ACCOUNT_MIXER_START", error });
    }
  }

  return (
    <PrivacyContent
      {...{
        mixedAccountName,
        accountMixerRunning,
        error,
        csppServer,
        csppPort,
        changeAccountName,
        onStartMixerAttempt,
        stopAccountMixer,
        mixedAccountBranch
      }}
    />
  );
};

export default Privacy;
