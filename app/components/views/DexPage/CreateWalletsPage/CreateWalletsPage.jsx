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
    onNewBTCConfig,
    btcConfigUpdateNeeded,
    btcInstallNeeded,
    btcWalletName
  } = useDex();

  const {
    walletName,
    setWalletName,
    onCreateWallet,
    onBTCCreateWallet,
    onNewBTCConfigDex,
    setBitcoinDirectory
  } = useDexCreateWallets({
    btcWalletName,
    dexAccount,
    onBTCCreateWalletDex,
    onCreateWalletDex,
    onCheckBTCConfig,
    onNewBTCConfig
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
              id="walletNameInput"
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
            <T
              id="dex.neededFieldsInConfig"
              m="The following fields are required in the bitcoin.conf rpcuser, rpcpassword, rpcbind, rpcport. You must also set 'server=1' to start the wallet listening for connections.  If you have any trouble with these instructions, please go to the support channel on chat.decred.org for further assistance."
            />
            <KeyBlueButton onClick={onCheckBTCConfig}>
              <T id="dex.checkBTCConfigButtonTryAgain" m="Check again" />
            </KeyBlueButton>
          </div>
        ) : btcInstallNeeded ? (
          <div>
            <T
              id="dex.checkBTCConfig"
              m="You must confirm your bitcoin.conf is properly set up for connecting to DEX. If you have not yet installed a bitcoin wallet, please go to bitcoin.org for further instructions."
            />
            <T
              id="dex.checkBTCConfigInstalled"
              m="If you have already installed bitcoin.conf, but have not created a bitcoin.conf file, we can create one for you with the button below."
            />
            <KeyBlueButton onClick={onNewBTCConfigDex}>
              <T id="dex.updateBTCConfigButton" m="Create BTC Config" />
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
            m="BTC Wallet has been successfully connected!"
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
            m="DCR Wallet has been successfully connected!"
          />
        </div>
      )}
    </div>
  );
};

export default CreateWalletsPage;
