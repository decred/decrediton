import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { PiUiPassphraseModalButton } from "buttons";
import { Tooltip } from "pi-ui";
import {
  LNWALLET_STARTUPSTAGE_STARTDCRLND,
  LNWALLET_STARTUPSTAGE_CONNECT,
  LNWALLET_STARTUPSTAGE_UNLOCK,
  LNWALLET_STARTUPSTAGE_STARTUPSYNC,
  LNWALLET_STARTUPSTAGE_SCBRESTORE
} from "actions/LNActions";
import styles from "./ConnectPage.module.css";
import { LN_ICON } from "constants";
import { useConnectPage } from "./hooks";
import { CreateLNWallet, CreateLNWalletHeader } from "./CreateLNWallet";
import CreationWarning from "./CreationWarning";
import { AutopilotSwitch } from "./AutopilotSwitch";
import { LinearProgressSmall } from "indicators";

const stageMsgs = {
  [LNWALLET_STARTUPSTAGE_STARTDCRLND]: (
    <T id="ln.startupStage.startDcrlnd" m="Starting dcrlnd" />
  ),
  [LNWALLET_STARTUPSTAGE_CONNECT]: (
    <T id="ln.startupStage.connect" m="Connecting to dcrlnd" />
  ),
  [LNWALLET_STARTUPSTAGE_UNLOCK]: (
    <T id="ln.startupStage.unlock" m="Unlocking LN wallet" />
  ),
  [LNWALLET_STARTUPSTAGE_STARTUPSYNC]: (
    <T id="ln.startupStage.startupSync" m="Syncing LN wallet to network" />
  ),
  [LNWALLET_STARTUPSTAGE_SCBRESTORE]: (
    <T id="ln.startupStage.scbRestore" m="Restoring backup" />
  )
};

const ConnectPageHeader = () => (
  <StandaloneHeader
    title={<T id="ln.connectPage.title" m="Start Lightning Wallet" />}
    description={
      <T
        id="ln.connectPage.description"
        m={"Start, unlock and connect to the dcrlnd wallet."}
      />
    }
    iconType={LN_ICON}
  />
);

const ConnectPage = () => {
  const {
    lightningWalletExists,
    startAttempt,
    startupStage,
    autopilotEnabled,
    account,
    accountOption,
    scbFile,
    setScbFile,
    displayCreationWarning,
    onChangeAccount,
    onLaunch,
    onChangeEnableAutopilot,
    onAccountOptionClick,
    onAcceptCreationWarning,
    runningIndicator,
    lastLogLine,
    routerPruneTarget,
    routerPruneHeight,
    routerPruneStart,
    intl
  } = useConnectPage();

  return (
    <StandalonePage
      header={
        displayCreationWarning || !lightningWalletExists ? (
          <CreateLNWalletHeader />
        ) : (
          <ConnectPageHeader />
        )
      }>
      {displayCreationWarning ? (
        <CreationWarning onAcceptCreationWarning={onAcceptCreationWarning} />
      ) : (
        <div>
          <div className={styles.connectOpts}>
            {!lightningWalletExists && (
              <CreateLNWallet
                account={account}
                accountOption={accountOption}
                scbFile={scbFile}
                setScbFile={setScbFile}
                onChangeAccount={onChangeAccount}
                onAccountOptionClick={onAccountOptionClick}
                intl={intl}
              />
            )}
            <AutopilotSwitch
              onChange={onChangeEnableAutopilot}
              autopilotEnabled={autopilotEnabled}
            />
          </div>
          <div className={styles.buttonContrainer}>
            {runningIndicator ? (
              <Tooltip
                contentClassName={styles.disabledTooltip}
                content={
                  <T
                    id="ln.connectPage.disabled.unlockWalletModal"
                    m="Privacy Mixer, Autobuyer or Purchase Ticket Attempt running, please shut them off before unlock LN Wallet."
                  />
                }>
                <PiUiPassphraseModalButton
                  modalTitle={
                    <T
                      id="ln.connectPage.unlockWalletModal"
                      m="Unlock LN Wallet"
                    />
                  }
                  disabled={true}
                  loading={startAttempt}
                  buttonLabel={
                    <T
                      id="ln.connectPage.launchBtn"
                      m="Start and Unlock LN Wallet"
                    />
                  }
                />
              </Tooltip>
            ) : (
              <PiUiPassphraseModalButton
                modalTitle={
                  <T id="ln.connectPage.running" m="Unlock LN Wallet" />
                }
                disabled={startAttempt}
                onSubmit={onLaunch}
                loading={startAttempt}
                buttonLabel={
                  <T
                    id="ln.connectPage.launchBtn"
                    m="Start and Unlock LN Wallet"
                  />
                }
              />
            )}
          </div>
          {stageMsgs[startupStage] && <div>{stageMsgs[startupStage]}</div>}
          {routerPruneTarget != routerPruneHeight && (
            <LinearProgressSmall
              className={styles.linearProgress}
              value={routerPruneHeight}
              max={routerPruneTarget}
              min={routerPruneStart}
            />
          )}
          <div className={styles.logLine}>{lastLogLine}</div>
        </div>
      )}
    </StandalonePage>
  );
};

export default ConnectPage;
