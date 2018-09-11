import { AnimatedLinearProgressFull } from "indicators";
import { FormattedMessage as T, FormattedRelative, injectIntl, defineMessages } from "react-intl";
import { KeyBlueButton, SlateGrayButton, InvisibleButton, AboutModalButtonInvisible } from "buttons";
import { PasswordInput } from "inputs";
import { Tooltip } from "shared";
import { shell } from "electron";
import "style/GetStarted.less";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "getStarted.discoverAddresses.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const SpvSyncBody = ({
  text,
  animationType,
  getWalletReady,
  onShowSettings,
  onShowLogs,
  onShowTutorial,
  onShowReleaseNotes,
  startupError,
  updateAvailable,
  appVersion,
  passPhrase,
  intl,
  onSetPassPhrase,
  onSpvSync,
  onKeyDown,
  syncInput,
  firstBlockTime,
  syncFetchTimeStart,
  syncFetchHeadersLastHeaderTime,
  lastDcrwalletLogLine,
  Form,
  syncFetchHeadersAttempt,
  syncFetchHeadersComplete,
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
                <Aux>
                  <InvisibleButton onClick={onShowSettings}>
                    <T id="getStarted.btnSettings" m="Settings" />
                  </InvisibleButton>
                  <InvisibleButton onClick={onShowLogs}>
                    <T id="getStarted.btnLogs" m="Logs" />
                  </InvisibleButton>
                </Aux>
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
            <AnimatedLinearProgressFull
              text={text}
              animationType={animationType}
              error={startupError}
              getDaemonSynced={syncFetchHeadersComplete}
              disabled={!syncFetchHeadersComplete && syncFetchHeadersLastHeaderTime == null}
              min={firstBlockTime.getTime()}
              max={syncFetchTimeStart ? syncFetchTimeStart.getTime() : firstBlockTime.getTime()}
              value={syncFetchHeadersLastHeaderTime ? syncFetchHeadersLastHeaderTime.getTime() : firstBlockTime.getTime()}
            />
            {syncFetchHeadersAttempt &&
              <div className="loader-bar-estimation">
                <T id="getStarted.chainLoading.headerTime" m="Time from last fetched header:"/>
                <span className="bold"> {syncFetchHeadersLastHeaderTime ? <FormattedRelative value={syncFetchHeadersLastHeaderTime}/> : "--" }</span>
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
        {Form && <Form {...props}/>}
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
                  autoFocus
                  className="get-started-input-private-password"
                  placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
                  value={passPhrase}
                  onChange={(e) => onSetPassPhrase(e.target.value)}
                  onKeyDown={onKeyDown}/>
              </div>
            </div>
            <div className="loader-bar-buttons">
              <KeyBlueButton onClick={onSpvSync}>
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

export default injectIntl(SpvSyncBody);
