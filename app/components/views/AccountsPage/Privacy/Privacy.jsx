import PrivacyContent from "./PrivacyContent";
import ConfigMixer from "./ConfigMixer/ConfigMixer";
import { usePrivacy } from "./hooks";

const Privacy = ({ isCreateAccountDisabled }) => {
  const {
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    accounts,
    accountMixerError,
    onStartMixerAttempt
  } = usePrivacy();

  return !mixedAccount && !changeAccount ? (
    <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />
  ) : (
    <PrivacyContent
      {...{
        accountMixerRunning,
        accountMixerError,
        onStartMixerAttempt,
        stopAccountMixer
      }}
    />
  );
};

export default Privacy;
