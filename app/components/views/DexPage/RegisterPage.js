import { useDex } from "./hooks";
import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { Balance } from "shared";
import { useEffect, useState, useCallback } from "react";
import { TextInput } from "inputs";
import { StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import style from "./DexPage.module.css";

export const RegisterPageContent = () => {
  const {
    onRegisterDex,
    registerDexAttempt,
    onGetConfig,
    dexConfig,
    dexAddr,
    defaultServerAddress,
    dexRegisterError
  } = useDex();
  const [isValid, setIsValid] = useState(false);
  const [addr, setAddress] = useState(defaultServerAddress);
  const [error, setIsError] = useState("");

  const resetState = useCallback(() => {
    setAddress(null);
  }, []);

  const onGetConfigDex = () => {
    onGetConfig(addr);
    resetState();
  };

  useEffect(() => {
    setIsValid(!!addr);
  }, [addr]);

  useEffect(() => {
    if (addr === null) {
      return;
    }
    if (isValid) {
      setIsError(null);
      return;
    }
    if (!addr) {
      const error = (
        <T id="error.Dex.Address" m="Please enter a valid DEX Server." />
      );
      setIsError(error);
      return;
    }
  }, [isValid, addr]);

  if (dexConfig && dexAddr) {
    return (
      <div>
        <T
          id="dex.payRegistration.Fee"
          m="Please enter your DEX app passphrase to pay the following fee:"
        />
        <Balance amount={dexConfig.feeAsset.amount} />
        <T
          id="dex.payRegistration.Address"
          m="DEX Server registering to:"
        />{" "}
        {dexAddr}
        <PassphraseModalButton
          disabled={registerDexAttempt}
          modalTitle={<T id="dex.payDexFeeModalTitle" m="Pay DEX Fee" />}
          modalDescription={
            <T
              id="dex.payDexFeeModalDescription"
              m="Please enter your DEX App passphrase to pay the fee to register to the DEX Server"
            />
          }
          passphraseLabel={
            <T id="dex.payDexFeeAppPassphrase" m="DEX Passphrase" />
          }
          loading={registerDexAttempt}
          onSubmit={onRegisterDex}
          buttonLabel={<T id="dex.payDexFeeButton" m="Pay DEX Fee" />}
        />
        {dexRegisterError && (
          <div className={style.error}>{dexRegisterError}</div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <TextInput
          required
          value={addr}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="DEX Server"
        />
        {error && <div className="error">{error}</div>}
        <KeyBlueButton
          disabled={!isValid || registerDexAttempt}
          loading={registerDexAttempt}
          onClick={onGetConfigDex}>
          <T id="dex.getFeeButton" m="Get Fee to Pay" />
        </KeyBlueButton>
      </div>
    );
  }
};

export const RegisterPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.registerPage.title" m="DEX Server Payment" />}
    description={
      <T
        id="dex.registerPage.description"
        m={"Register your wallet with the DEX Server"}
      />
    }
    iconType={DEX_ICON}
  />
);
