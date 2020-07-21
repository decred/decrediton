import PrivacyContent from "./PrivacyContent";
import ConfigMixer from "./ConfigMixer/ConfigMixer";
import { usePrivacy } from "./hooks";

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
    accountMixerError,
    mixedAccountName,
    changeAccountName,
    onStartMixerAttempt
  } = usePrivacy();

  return !mixedAccount && !changeAccount ? (
    <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />
  ) : (
    <PrivacyContent
      {...{
        mixedAccountName,
        accountMixerRunning,
        accountMixerError,
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
