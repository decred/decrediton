import { LinearProgressFull } from "indicators";
import { FormattedMessage as T, FormattedRelative, injectIntl, defineMessages } from "react-intl";
import { SlateGrayButton, InvisibleButton, KeyBlueButton } from "buttons";
import { PasswordInput } from "inputs";
import { Tooltip } from "shared";
import { shell } from "electron";
import "style/GetStarted.less";
import { AboutModalButtonInvisible } from "buttons";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "getStarted.discoverAddresses.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const DaemonLoadingBody = ({
  Form,
  text,
  animationType,
  isInputRequest,
  getCurrentBlockCount,
  getWalletReady,
  getDaemonStarted,
  getDaemonSynced,
  getNeededBlocks,
  finishDateEstimation,
  onShowSettings,
  onShowLogs,
  onShowTutorial,
  onShowReleaseNotes,
  startupError,
  updateAvailable,
  appVersion,
  isDaemonRemote,
  isSPV,
  syncInput,
  passPhrase,
  intl,
  lastDcrwalletLogLine,
  onSetPassPhrase,
  onKeyDown,
  onRPCSync,
  hasAttemptedDiscover,
  ...props,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader">
      <Aux>
        <div className="content-title">
          <div className="loader-settings-logs">
            {updateAvailable &&
              <Tooltip text={<T id="getStarted.updateAvailableTooltip" m="New version {version} available" values={{ version: (updateAvailable) }}/>}>
                <InvisibleButton className="update-available-button" onClick={() => shell.openExternal("https://decred.org/downloads")}>
                  <T id="getStarted.updateAvailable" m="Update Available" />
                </InvisibleButton>
              </Tooltip>
            }
            <Aux>
              <AboutModalButtonInvisible version={appVersion} updateAvailable={updateAvailable} buttonLabel={<T id="help.about" m="About Decrediton" />}/>
              {getWalletReady &&
                  <InvisibleButton onClick={onShowSettings}>
                    <T id="getStarted.btnSettings" m="Settings" />
                  </InvisibleButton>
              }
              {(getDaemonStarted && !isDaemonRemote) || getWalletReady ?
                <InvisibleButton onClick={onShowLogs}>
                  <T id="getStarted.btnLogs" m="Logs" />
                </InvisibleButton> :
                <div/>
              }
            </Aux>
          </div>
          <T id="loader.title" m={"Welcome to Decrediton Wallet"}/>
        </div>
        <div className="loader-buttons">
          <SlateGrayButton className="tutorial-button" onClick={onShowTutorial}>
            <T id="getStarted.learnBasics" m="Learn the Basics" />
          </SlateGrayButton>
          <span onClick={onShowReleaseNotes} className="whatsnew"><T id="getStarted.whatsNew" m="What's New in v{version}" values={{ version: (appVersion) }}/></span>
        </div>
        <div className="loader-bar">
          <Aux>
            <LinearProgressFull
              animationType={animationType}
              text={text}
              error={startupError}
              getDaemonSynced={getDaemonSynced}
              disabled={!getDaemonStarted || getCurrentBlockCount == null}
              min={0}
              max={getNeededBlocks}
              value={getCurrentBlockCount}
            />
            {!getDaemonStarted || getCurrentBlockCount == null || getDaemonSynced ? <div></div> :
              <div className="loader-bar-estimation">
                <T id="getStarted.chainLoading.syncEstimation" m="Estimated time left"/>
                <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
              </div>
            }
          </Aux>
        </div>
        <div className="loader-bar-icon">
          {startupError &&
            <div className="loader-bar-icon-text error">
              {startupError}
            </div>
          }
        </div>
        { Form && <Form {...{ ...props, isInputRequest, startupError, getCurrentBlockCount, getDaemonSynced, isSPV }}/> }
        {syncInput ?
          <div className="advanced-page-form">
            <div className="advanced-daemon-row">
              <T id="getStarted.discoverAccountsInfo" m={`
                Enter the passphrase you just created to scan the blockchain for additional accounts you may have previously created with your wallet.

                Your account names aren't stored on the blockchain, so you will have to rename them after setting up Decrediton.
              `}/>
            </div>
            <div className="advanced-daemon-row">
              <div className="advanced-daemon-label">
                <T id="getStarted.discover.label" m="Scan for accounts" />
              </div>
              <div className="advanced-daemon-input">
                <PasswordInput
                  required
                  autoFocus
                  className="get-started-input-private-password"
                  placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
                  value={passPhrase}
                  onChange={(e) => onSetPassPhrase(e.target.value)}
                  onKeyDown={onKeyDown}
                  showErrors={hasAttemptedDiscover}/>
              </div>
            </div>
            <div className="loader-bar-buttons">
              <KeyBlueButton onClick={onRPCSync} disabled={!passPhrase}>
                <T id="getStarted.discoverAddresses.scanBtn" m="Scan" />
              </KeyBlueButton>
            </div>
          </div> :
          <div className="get-started-last-log-lines">
            <div className="last-dcrwallet-log-line">{lastDcrwalletLogLine}</div>
          </div>
        }
      </Aux>
    </div>
  </div>
);

export default injectIntl(DaemonLoadingBody);