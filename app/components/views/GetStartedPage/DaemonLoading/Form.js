import { LinearProgressFull, DecredLoading } from "indicators";
import { FormattedMessage as T, FormattedRelative, injectIntl } from "react-intl";
import { SlateGrayButton, InvisibleButton, KeyBlueButton } from "buttons";
import { PasswordInput } from "inputs";
import "style/GetStarted.less";
import { LogsLinkMsg, SettingsLinkMsg, DiscoverLabelMsg,
  DiscoverAccountsInfoMsg, ScanBtnMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton, messages } from "../messages";

const DaemonLoadingBody = ({
  Form,
  text,
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
            {updateAvailable && <UpdateAvailableLink updateAvailable={updateAvailable} /> }
            <Aux>
              <AboutModalButton { ...{ appVersion, updateAvailable } } />
              {getWalletReady &&
                  <InvisibleButton onClick={onShowSettings}>
                    <SettingsLinkMsg />
                  </InvisibleButton>
              }
              {(getDaemonStarted && !isDaemonRemote) || getWalletReady ?
                <InvisibleButton onClick={onShowLogs}>
                  <LogsLinkMsg />
                </InvisibleButton> :
                <div/>
              }
            </Aux>
          </div>
          <LoaderTitleMsg />
        </div>
        <div className="loader-buttons">
          <SlateGrayButton className="tutorial-button" onClick={onShowTutorial}>
            <LearnBasicsMsg />
          </SlateGrayButton>
          <WhatsNewLink {...{ onShowReleaseNotes, appVersion }} />
        </div>
        <div className="loader-bar">
          <Aux>
            <LinearProgressFull
              text={text}
              error={startupError}
              getDaemonSynced={getDaemonSynced}
              disabled={!getDaemonStarted || getCurrentBlockCount == null}
              min={0}
              max={getNeededBlocks}
              value={getCurrentBlockCount}
            />
            {!getDaemonStarted || getCurrentBlockCount == null || getDaemonSynced ? <div/>
              :
              <div className="loader-bar-estimation">
                <T id="getStarted.chainLoading.syncEstimation" m="Estimated time left"/>
                <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
              </div>
            }
          </Aux>
        </div>
        <div className="loader-bar-icon">
          {text && !startupError &&
            <div className="loader-bar-icon-text">
              {text}...
            </div>
          }
          {startupError &&
            <div className="loader-bar-icon-text error">
              {startupError}
            </div>
          }
          <DecredLoading hidden={startupError || isInputRequest} />
        </div>
        { Form && <Form {...{ ...props, isInputRequest, startupError, getCurrentBlockCount, getDaemonSynced, isSPV }}/> }
        {syncInput ?
          <div className="advanced-page-form">
            <div className="advanced-daemon-row">
              <DiscoverAccountsInfoMsg />
            </div>
            <div className="advanced-daemon-row">
              <div className="advanced-daemon-label">
                <DiscoverLabelMsg />
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
                <ScanBtnMsg />
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
