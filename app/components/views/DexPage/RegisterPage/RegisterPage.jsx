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
    dexConfig,
    dexAddr,
    defaultServerAddress,
    dexRegisterError
  } = useDex();

  const {
    isValid,
    error,
    onGetConfigDex,
    addr,
    setAddress,
    dexAccountNumber,
    defaultSpendingAccount,
    dexAccountSpendable
  } = useDexRegisterPage({
    onGetConfig,
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
            <T id="dex.sendToDexAccount.title" m="Send to Dex Account" />
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
  } else {
    return (
      <div>
        <TextInput
          className={styles.dexAddress}
          required
          value={addr}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="DEX Server"
        />
        {error && <div className="error">{error}</div>}
        <KeyBlueButton
          className="margin-top-m"
          disabled={!isValid || registerDexAttempt}
          loading={registerDexAttempt}
          onClick={onGetConfigDex}>
          <T id="dex.getFeeButton" m="Get Fee to Pay" />
        </KeyBlueButton>
      </div>
    );
  }
};

export default RegisterPage;
