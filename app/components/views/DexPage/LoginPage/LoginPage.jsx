import { useDex } from "../hooks";
import { PassphraseModalButton } from "buttons";
import { FormattedMessage as T, defineMessages } from "react-intl";

const messages = defineMessages({
  dexPassphraseLabelText: {
    id: "dex.loginDexPassphrase",
    defaultMessage: "DEX Passphrase"
  }
});

const LoginPage = () => {
  const { onLoginDex, loginDexAttempt, intl } = useDex();

  return (
    <PassphraseModalButton
      disabled={loginDexAttempt}
      passphraseLabel={intl.formatMessage(messages.dexPassphraseLabelText)}
      modalTitle={<T id="dex.loginPassphrase" m="Enter DEX Passphrase" />}
      loading={loginDexAttempt}
      onSubmit={onLoginDex}
      buttonLabel={<T id="dex.loginPassphraseButton" m="Login" />}
    />
  );
};

export default LoginPage;
