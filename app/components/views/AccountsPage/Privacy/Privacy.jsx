import PrivacyContent from "./PrivacyContent";
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
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    csppServer,
    csppPort,
    mixedAccountBranch,
    accounts,
    error,
    mixedAccountName,
    changeAccountName,
    onStartMixerAttempt
  } = usePrivacy(validateErrorReducer);

  return !mixedAccount && !changeAccount ? (
    <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />
  ) : (
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
