import { useDex } from "../hooks";
import { PassphraseModalButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const LoginPage = () => {
  const { onLoginDex, loginAttempt } = useDex();

  return (
    <PassphraseModalButton
      disabled={loginAttempt}
      passphraseLabel={<T id="dex.loginDexPassphrase" m="DEX Passphrase" />}
      modalTitle={<T id="dex.loginPassphrase" m="Enter DEX Passphrase" />}
      loading={loginAttempt}
      onSubmit={onLoginDex}
      buttonLabel={<T id="dex.loginPassphraseButton" m="Login" />}
    />
  );
};

export default LoginPage;
