import { FormattedMessage as T } from "react-intl";
import { classNames, Checkbox, Message } from "pi-ui";
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
    btcWalletName,
    onUseBtcSpv,
    onDoNotUseBtcSPV,
    dexBtcSpv,
    askDexBtcSpv
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
      <div className={styles.subtitle}>
        <T id="dex.subtitle.btcWallet" m="BTC wallet" />
      </div>
      {!askDexBtcSpv ? (
        <div className={classNames("flex-row", "align-center", styles.box)}>
          <div className={classNames("flex-column", "align-center")}>
            <strong>
              <T id="dex.doNotUseBTCSPV.simpleSetup" m="Simple Setup" />
            </strong>
            <KeyBlueButton className="margin-top-s" onClick={onUseBtcSpv}>
              <T id="dex.useBTCSPV" m="Use DEX Native BTC" />
            </KeyBlueButton>
          </div>
          <div className={classNames("margin-left-s", "margin-right-s")}>
            <T id="dex.doNotUseBTCSPV.or" m="or" />
          </div>
          <div className={classNames("flex-column", "align-center")}>
            <strong>
              <T id="dex.doNotUseBTCSPV.advancedSetup" m="Advanced Setup" />
            </strong>
            <KeyBlueButton className="margin-top-s" onClick={onDoNotUseBtcSPV}>
              <T id="dex.doNotUseBTCSPV" m="Use Bitcoind Wallet" />
            </KeyBlueButton>
          </div>
        </div>
      ) : !dexBtcSpv ? (
        !dexBTCWalletRunning ? (
          btcConfig ? (
            <div className={styles.box}>
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
              <div
                className={classNames(
                  "margin-top-m",
                  "align-center",
                  "flex-column"
                )}>
                <AppPassAndPassphraseModalButton
                  passphraseLabel={
                    <T
                      id="dex.createBTCWalletPassphrase"
                      m="BTC Passphrase (if set)"
                    />
                  }
                  modalTitle={
                    <T id="dex.createBTCWallet" m="Connect BTC Wallet" />
                  }
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
              </div>
            </div>
          ) : (
            <div className={styles.box}>
              {!btcConfigUpdateNeeded && !btcInstallNeeded && (
                <div
                  className={classNames(
                    "margin-top-s",
                    styles.btcConfigNeededArea,
                    "flex-column"
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
                        m="If you have a non-default bitcoin location, please check the box and identify the location."
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
                  <div
                    className={classNames(
                      "margin-top-m",
                      "align-center",
                      "flex-column"
                    )}>
                    <KeyBlueButton onClick={onCheckBTCConfigDex}>
                      <T id="dex.findBTCConfigButton" m="Find bitcoin conf" />
                    </KeyBlueButton>
                  </div>
                </div>
              )}
              {btcConfigUpdateNeeded && (
                <div
                  className={classNames(
                    "margin-top-m",
                    "align-center",
                    "flex-column"
                  )}>
                  <div>
                    <T
                      id="dex.updateBTCConfig"
                      m="You must update your bitcoin.conf to properly communicate with the DEX."
                    />
                    <T
                      id="dex.neededFieldsInConfig"
                      m="The following fields are required in the bitcoin.conf rpcuser, rpcpassword, rpcbind, rpcport. You must also set 'server=1' to start the wallet listening for connections.  If you have any trouble with these instructions, please go to the support channel on chat.decred.org for further assistance."
                    />
                  </div>
                  <KeyBlueButton
                    className="margin-top-m"
                    onClick={onCheckBTCConfigDex}>
                    <T id="dex.checkBTCConfigButtonTryAgain" m="Try again" />
                  </KeyBlueButton>
                </div>
              )}
              {btcInstallNeeded && (
                <div
                  className={classNames(
                    "margin-top-m",
                    "align-center",
                    "flex-column"
                  )}>
                  <div>
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
          <div className={styles.box}>
            <Message kind="success">
              <T
                id="dex.btcWalletConnected"
                m="BTC Wallet has been successfully connected!"
              />
            </Message>
          </div>
        )
      ) : (
        <div className={styles.box}>
          <Message kind="success">
            <T
              id="dex.usingBtcSpv"
              m="You have chosen to use the integrated BTC Wallet."
            />
          </Message>
        </div>
      )}
      <div className={classNames(styles.subtitle, "margin-top-m")}>
        <T id="dex.subtitle.dcrWallet" m="DCR wallet" />
      </div>
      {!dexDCRWalletRunning ? (
        <div className={classNames(styles.box, "justify-center")}>
          <AppPassAndPassphraseModalButton
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
        </div>
      ) : (
        <div className={styles.box}>
          <Message kind="success">
            <T
              id="dex.dcrWalletConnected"
              m="DCR Wallet has been successfully connected!"
            />
          </Message>
        </div>
      )}
    </div>
  );
};

export default CreateWalletsPage;
