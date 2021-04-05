import { useDex } from "./hooks";
import { PassphraseModalButton } from "buttons";
import { StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";

export const LoginPageContent = () => {
  const { onLoginDexc, loginAttempt } = useDex();

  return (
    <PassphraseModalButton
      disabled={loginAttempt}
      modalTitle={<T id="dex.initPassphrase" m="Enter Dexc App Passphrase" />}
      loading={loginAttempt}
      onSubmit={onLoginDexc}
      buttonLabel={<T id="dex.initPassphraseButton" m="Login" />}
    />
  );
};

export const LoginPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.loginPage.title" m="DEX Login" />}
    description={
      <T id="dex.loginPage.description" m={"Login and connect wallet to Dex"} />
    }
    iconType={DEX_ICON}
  />
);
