import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import { useDex } from "../hooks";
import { useDexCreateWallets } from "./hooks";
import { AppPassAndPassphraseModalButton, KeyBlueButton } from "buttons";
import { TextInput } from "inputs";
import styles from "./CreateWalletsPage.module.css";

const CreateWalletsPage = () => {
  const {
    onCreateWalletDex,
    createWalletDexAttempt,
    onBTCCreateWalletDex,
    dexDCRWalletRunning,
    dexBTCWalletRunning,
    dexAccount,
    btcConfig,
    onCheckBTCConfig,
    onUpdateBTCConfig,
    btcConfigUpdateNeeded,
    btcInstallNeeded,
    btcWalletName
  } = useDex();

  const {
    walletName,
    setWalletName,
    onCreateWallet,
    onBTCCreateWallet
  } = useDexCreateWallets({
    btcWalletName,
    dexAccount,
    onBTCCreateWalletDex,
    onCreateWalletDex,
    onCheckBTCConfig
  });

  return (
    <div className="flex-column align-start">
      {!dexBTCWalletRunning ? (
        btcConfig ? (
          <>
            <div>
              <T
                id="dex.connectBTCWallet"
                m="Please enter the name of your BTC Wallet then attempt to connect to the wallet."
              />
            </div>
            <div className="margin-top-s">
              <T
                id="dex.connectBTCWalletNote"
                m="Note: we have found a bitcoin.conf at the default location which will be used to communicate with your BTC Wallet."
              />
            </div>
            <div className="margin-top-s">
              <T
                id="dex.connectBTCWalletNote2"
                m="Make sure you BTC Wallet is currently running before attempting to connect."
              />
            </div>
            <TextInput
              className={classNames("margin-top-m", styles.walletNameInput)}
              required
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="BTC Wallet Name (leave empty if unnamed default wallet)"
            />
            <AppPassAndPassphraseModalButton
              className="margin-top-m"
              passphraseLabel={
                <T
                  id="dex.createBTCWalletPassphrase"
                  m="BTC Passphrase (if set)"
                />
              }
              modalTitle={<T id="dex.createBTCWallet" m="Connect BTC Wallet" />}
              loading={createWalletDexAttempt}
              onSubmit={onBTCCreateWallet}
              buttonLabel={
                <T
                  id="dex.createWalletBTCPassphraseButton"
                  m="Connect BTC Wallet"
                />
              }
              passphraseNotRequired
            />
          </>
        ) : btcConfigUpdateNeeded ? (
          <div>
            <T
              id="dex.updateBTCConfig"
              m="You must update your bitcoin.conf to properly communicate with the DEX."
            />
            <KeyBlueButton onClick={onUpdateBTCConfig}>
              <T id="dex.updateBTCConfigButton" m="Update BTC Config" />
            </KeyBlueButton>
          </div>
        ) : btcInstallNeeded ? (
          <div>
            <T
              id="dex.checkBTCConfig"
              m="You must confirm your Bitcoin.conf is properly set up for connecting to DEX. If you have not yet installed a bitcoin wallet, please go to bitcoin.org for further instructions."
            />
            <KeyBlueButton onClick={onCheckBTCConfig}>
              <T id="dex.checkBTCConfigButton" m="Check BTC Config" />
            </KeyBlueButton>
          </div>
        ) : (
          <div>
            <T
              id="dex.btcConfigError"
              m="Something has gone wrong and we are unable to obtain your bitcoin.conf, please try again."
            />
            <KeyBlueButton onClick={onCheckBTCConfig}>
              <T id="dex.checkBTCConfigButton" m="Check BTC Config" />
            </KeyBlueButton>
          </div>
        )
      ) : (
        <div>
          <T
            id="dex.btcWalletConnected"
            m="BTC Wallet has been sucessfully connected!"
          />
        </div>
      )}
      {!dexDCRWalletRunning ? (
        <AppPassAndPassphraseModalButton
          className="margin-top-m"
          disabled={createWalletDexAttempt}
          modalTitle={<T id="dex.createDCRWallet" m="Connect DCR Wallet" />}
          loading={createWalletDexAttempt}
          onSubmit={onCreateWallet}
          buttonLabel={
            <T
              id="dex.createWalletDCRPassphraseButton"
              m="Connect DCR Wallet"
            />
          }
        />
      ) : (
        <div>
          <T
            id="dex.dcrWalletConnected"
            m="DCR Wallet has been sucessfully connected!"
          />
        </div>
      )}
    </div>
  );
};

export default CreateWalletsPage;
