import { FormattedMessage as T } from "react-intl";
import { classNames, Checkbox } from "pi-ui";
import { useDex } from "../hooks";
import { PathBrowseInput } from "inputs";
import { Input } from "../../GetStartedPage/helpers";
import { useDexCreateWallets } from "./hooks";
import { AppPassAndPassphraseModalButton, KeyBlueButton } from "buttons";
import { TextInput } from "inputs";
import styles from "./CreateWalletsPage.module.css";

const CreateWalletsPage = () => {
  const {
    onCreateWalletDex,
    createWalletDexAttempt,
    onBTCCreateWalletDex,
    btcCreateWalletDexAttempt,
    dexDCRWalletRunning,
    dexBTCWalletRunning,
    dexAccount,
    btcConfig,
    onNewBTCConfig,
    onCheckBTCConfig,
    btcConfigUpdateNeeded,
    btcInstallNeeded,
    btcWalletName
  } = useDex();

  const {
    walletName,
    setWalletName,
    onCreateWallet,
    onBTCCreateWallet,
    onCheckBTCConfigDex,
    onNewBTCConfigDex,
    bitcoinDirectory,
    setBitcoinDirectory,
    hasNonDefault,
    toggleHasNonDefault
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
              loading={btcCreateWalletDexAttempt}
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
        ) : (
          <div>
            {!btcConfigUpdateNeeded && !btcInstallNeeded && (
              <div
                className={classNames(
                  "margin-top-s",
                  styles.btcConfigNeededArea
                )}>
                <Checkbox
                  label={
                    <T
                      id="dex.btcWalletLocation.label"
                      m="You have a non-default bitcoin directory"
                    />
                  }
                  id="hasDexSeed"
                  description={
                    <T
                      id="dex.btcWalletLocation.description"
                      m="If you have a non-default bitcoin location, please check the box and indentify the location."
                    />
                  }
                  checked={hasNonDefault}
                  onChange={toggleHasNonDefault}
                />
                {hasNonDefault && (
                  <Input className="margin-top-m">
                    <PathBrowseInput
                      id="btcDirectory"
                      required
                      type="directory"
                      value={bitcoinDirectory}
                      onChange={(value) => setBitcoinDirectory(value)}
                      placeholder="Bitcoin Directory"
                    />
                  </Input>
                )}
                <KeyBlueButton
                  className="margin-top-m"
                  onClick={onCheckBTCConfigDex}>
                  <T id="dex.findBTCConfigButton" m="Find bitcoin conf" />
                </KeyBlueButton>
              </div>
            )}
            {btcConfigUpdateNeeded && (
              <div className="margin-top-m">
                <T
                  id="dex.updateBTCConfig"
                  m="You must update your bitcoin.conf to properly communicate with the DEX."
                />
                <T
                  id="dex.neededFieldsInConfig"
                  m="The following fields are required in the bitcoin.conf rpcuser, rpcpassword, rpcbind, rpcport. You must also set 'server=1' to start the wallet listening for connections.  If you have any trouble with these instructions, please go to the support channel on chat.decred.org for further assistance."
                />
                <KeyBlueButton
                  className="margin-top-m"
                  onClick={onCheckBTCConfigDex}>
                  <T id="dex.checkBTCConfigButtonTryAgain" m="Try again" />
                </KeyBlueButton>
              </div>
            )}
            {btcInstallNeeded && (
              <div>
                <div className="margin-top-s">
                  <T
                    id="dex.checkBTCConfig"
                    m="You must confirm your bitcoin.conf is properly set up for connecting to DEX. If you have not yet installed a bitcoin wallet, please go to bitcoin.org for further instructions."
                  />
                </div>
                <div className="margin-top-s">
                  <T
                    id="dex.checkBTCConfigInstalled"
                    m="If you have already installed bitcoin.conf, but have not created a bitcoin.conf file, we can create one for you with the button below."
                  />
                </div>
                <KeyBlueButton
                  className="margin-top-m"
                  onClick={onNewBTCConfigDex}>
                  <T id="dex.updateBTCConfigButton" m="Create BTC Config" />
                </KeyBlueButton>
              </div>
            )}
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
