import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { Balance } from "shared";
import { TextInput } from "inputs";
import { useDex } from "../hooks";
import { useDexRegisterPage } from "./hooks";
import styles from "./RegisterPage.module.css";
import sendFormStyles from "./SendForm.module.css";
import SendOutputRow from "./SendOutputRow";
import { SendTransaction } from "shared";

const RegisterPage = () => {
  const {
    onRegisterDex,
    registerDexAttempt,
    onGetConfig,
    onPreregister,
    dexConfig,
    dexAddr,
    defaultServerAddress,
    dexRegisterError,
    restoredFromSeed
  } = useDex();

  const {
    isValid,
    error,
    onGetConfigDex,
    onPreRegisterDex,
    addr,
    setAddress,
    dexAccountNumber,
    defaultSpendingAccount,
    dexAccountSpendable,
    getConfigAttempt
  } = useDexRegisterPage({
    onGetConfig,
    onPreregister,
    defaultServerAddress
  });

  if (dexConfig && dexAddr) {
    return (
      <>
        <div className="margin-top-m">
          <T
            id="dex.payRegistration.Fee"
            m="Please enter your DEX passphrase to pay the following fee:"
          />
          <Balance amount={dexConfig.feeAsset.amount} />
          <T
            id="dex.payRegistration.Address"
            m="DEX Server registering to:"
          />{" "}
          {dexAddr}
        </div>
        <div className={styles.sendToDexAccount}>
          <div className={styles.title}>
            <T id="dex.sendToDexAccount.title" m="Send to DEX Account" />
          </div>
          <SendTransaction
            onlySendSelfAllowed={true}
            styles={sendFormStyles}
            receiveAccountsSelectDisabled={true}
            hideDetails={true}
            sendButtonLabel={<T id="send.dex.sendToSelfBtn" m="Send to Self" />}
            receiveAccount={dexAccountNumber}
            spendingAccount={defaultSpendingAccount}
            filterFromAccounts={[dexAccountNumber]}
            SendOutputRow={SendOutputRow}
          />
        </div>
        <PassphraseModalButton
          className="margin-top-m"
          disabled={
            registerDexAttempt ||
            dexAccountSpendable < dexConfig.feeAsset.amount
          }
          modalTitle={
            <T id="dex.payDexFeeModalTitle" m="Confirm Registration" />
          }
          modalDescription={
            <>
              <T
                id="dex.payDexFeeModalDescription"
                m="Enter your DEX passphrase to pay the registration fee of {fee} to register at the DEX of {address}."
                values={{
                  fee: (
                    <Balance
                      noSmallAmount
                      bold
                      amount={dexConfig.feeAsset.amount}
                    />
                  ),
                  address: dexAddr
                }}
              />
              <div className="margin-top-m">
                <T
                  id="dex.payDexFeeModalNote"
                  m="Note: The DCR lot size for this DEX is: "
                />
                <Balance
                  noSmallAmount
                  bold
                  amount={dexConfig.assets["42"].lotSize}
                />
              </div>
              <div className="margin-top-m margin-bottom-m">
                <T
                  id="dex.paDexFeeModalNote2"
                  m="All trades are in multiples of this lot size.  This is the minimum possible trade amount in DCR."
                />
              </div>
            </>
          }
          passphraseLabel={
            <T id="dex.payDexFeeAppPassphrase" m="DEX Passphrase" />
          }
          loading={registerDexAttempt}
          onSubmit={onRegisterDex}
          buttonLabel={<T id="dex.payDexFeeButton" m="Register" />}
        />
        {dexRegisterError && (
          <div className={styles.error}>{String(dexRegisterError)}</div>
        )}
      </>
    );
  } else if (restoredFromSeed) {
    return (
      <div>
        <label className={styles.dexAddressLabel} htmlFor="dexServer">
          <T id="dex.dexServer" m="DEX Server" />
        </label>
        <TextInput
          id="dexServer"
          className={styles.dexAddress}
          required
          value={addr}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="DEX Server"
        />
        {error && <div className="error">{error}</div>}
        <PassphraseModalButton
          className="margin-top-m"
          disabled={!isValid || getConfigAttempt}
          modalTitle={
            <T id="dex.preRegisterModalTitle" m="Confirm Registration Check" />
          }
          modalDescription={
            <T
              id="dex.preRegisterModalDescription"
              m="Since you have restored your DEX account from seed, we can now check to see if you have already paid your fee at the provided DEX server."
            />
          }
          passphraseLabel={
            <T id="dex.payDexFeeAppPassphrase" m="DEX Passphrase" />
          }
          loading={getConfigAttempt}
          onSubmit={onPreRegisterDex}
          buttonLabel={<T id="dex.preRegisterButton" m="Check Registration" />}
        />
      </div>
    );
  } else {
    return (
      <div>
        <label className={styles.dexAddressLabel} htmlFor="dexServer">
          <T id="dex.dexServer" m="DEX Server" />
        </label>
        <TextInput
          id="dexServer"
          className={styles.dexAddress}
          required
          value={addr}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="DEX Server"
        />
        {error && <div className="error">{error}</div>}
        <KeyBlueButton
          className="margin-top-m"
          disabled={!isValid || getConfigAttempt}
          loading={getConfigAttempt}
          onClick={onGetConfigDex}>
          <T id="dex.getFeeButton" m="Get Fee to Pay" />
        </KeyBlueButton>
      </div>
    );
  }
};

export default RegisterPage;
