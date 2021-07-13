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
  const { onLoginDex, loginAttempt, intl } = useDex();

  return (
    <PassphraseModalButton
      disabled={loginAttempt}
      passphraseLabel={intl.formatMessage(messages.dexPassphraseLabelText)}
      modalTitle={<T id="dex.loginPassphrase" m="Enter DEX Passphrase" />}
      loading={loginAttempt}
      onSubmit={onLoginDex}
      buttonLabel={<T id="dex.loginPassphraseButton" m="Login" />}
    />
  );
};

export default LoginPage;
