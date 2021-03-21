import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { Documentation } from "shared";
import { Checkbox, classNames } from "pi-ui";
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
import {
  default as CreateLNWallet,
  CreateLNWalletHeader
} from "./CreateLNWallet/CreateLNWallet";

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

const LNStartupStage = ({ stage }) =>
  stageMsgs[stage] && <div>{stageMsgs[stage]}</div>;

const LNCreationWarning = ({ onAcceptCreationWarning }) => (
  <>
    <Documentation name="LNWalletCreationWarning" />
    <KeyBlueButton onClick={onAcceptCreationWarning}>
      <T
        id="ln.createWalletWarning.okBtn"
        m="I understand and accept the risks"
      />
    </KeyBlueButton>
  </>
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
    onAcceptCreationWarning
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
        <LNCreationWarning onAcceptCreationWarning={onAcceptCreationWarning} />
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
              />
            )}
            <div className={classNames(styles.connectOpt, styles.checkbox)}>
              <Checkbox
                label={
                  <T
                    id="ln.connectPage.enableAutopilot"
                    m="Enable Automatic Channel Creation"
                  />
                }
                description={
                  <T
                    id="ln.connectPage.enableAutopilotDescr"
                    m="This enables the 'autopilot' feature, which tries to automatically open channels using up to 60% of the account's spendable funds."
                  />
                }
                checked={autopilotEnabled}
                onChange={onChangeEnableAutopilot}
              />
            </div>
          </div>

          <PassphraseModalButton
            modalTitle={
              <T id="ln.connectPage.unlockWalletModal" m="Unlock LN Wallet" />
            }
            disabled={startAttempt}
            onSubmit={onLaunch}
            loading={startAttempt}
            buttonLabel={
              <T id="ln.connectPage.launchBtn" m="Start and Unlock LN Wallet" />
            }
          />
          <LNStartupStage stage={startupStage} />
        </div>
      )}
    </StandalonePage>
  );
};

export default ConnectPage;
