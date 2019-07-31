import { FormattedMessage as T, FormattedRelative, injectIntl } from "react-intl";
import { SlateGrayButton, InvisibleButton, KeyBlueButton } from "buttons";
import { PasswordInput } from "inputs";
import "style/GetStarted.less";
import { LogsLinkMsg, SettingsLinkMsg, HeaderTimeMsg, DiscoverLabelMsg,
  DiscoverAccountsInfoMsg, ScanBtnMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton, messages } from "../messages";

const DaemonLoadingBody = ({
  Form,
  openWalletInputRequest,
  getCurrentBlockCount,
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
  isSPV,
  syncInput,
  passPhrase,
  intl,
  lastDcrwalletLogLine,
  onSetPassPhrase,
  onKeyDown,
  onRPCSync,
  hasAttemptedDiscover,
  syncFetchHeadersLastHeaderTime,
  syncFetchHeadersAttempt,
  daemonWarning,
  walletName,
  daemonTimeout,
  ...props,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader">
      <div className="loader-settings-logs">
        {updateAvailable && <UpdateAvailableLink updateAvailable={updateAvailable} /> }
        <>
          <AboutModalButton { ...{ appVersion, updateAvailable } } />
          <InvisibleButton onClick={onShowSettings}>
            <SettingsLinkMsg />
          </InvisibleButton>
          <InvisibleButton onClick={onShowLogs}>
            <LogsLinkMsg />
          </InvisibleButton>
        </>
      </div>
      <>
        <div className="content-title">
          <LoaderTitleMsg />
        </div>
        <div className="loader-buttons">
          <SlateGrayButton className="tutorial-button" onClick={onShowTutorial}>
            <LearnBasicsMsg />
          </SlateGrayButton>
          <WhatsNewLink {...{ onShowReleaseNotes, appVersion }} />
        </div>
        <div className="loader-bar">
          <>
            {daemonTimeout &&
              <span className="warning"><T id="getStarted.daemon.isTimeout" m="Daemon connection timeout exceded."/></span>
            }
            {!getDaemonStarted || getCurrentBlockCount == null || getDaemonSynced ?
              syncFetchHeadersAttempt &&
              <div className="loader-bar-estimation">
                <HeaderTimeMsg />
                <span className="bold"> {syncFetchHeadersLastHeaderTime ? <FormattedRelative value={syncFetchHeadersLastHeaderTime}/> : "--" }</span>
              </div>
              :
              <div className="loader-bar-estimation">
                { finishDateEstimation ? <T id="getStarted.chainLoading.syncEstimation" m="Blockchain download estimated complete"/> : null }
                <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : null} ({getCurrentBlockCount} / {getNeededBlocks})</span>
              </div>
            }
          </>
        </div>
        <div className="loader-bar-icon">
          {startupError &&
            <div className="loader-bar-icon-text error">
              {startupError}
            </div>
          }
        </div>
        {daemonWarning && getCurrentBlockCount <= 0 ?
          <>
            <div className="get-started-last-log-lines">
              <div className="last-dcrwallet-log-line">{daemonWarning}</div>
            </div>
            <div className="advanced-page-form">
              <div className="advanced-daemon-row">
                <T id="getStarted.longWaitWarning" m="You are currently upgrading to a new dcrd version.  Typically, this one-time reindexing will take 30-45 minutes on an average machine."/>
              </div>
            </div>
          </>:
          <div/>
        }
        { Form && <Form {...{ ...props, openWalletInputRequest, startupError, getCurrentBlockCount, getDaemonSynced, isSPV }}/> }
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
          </div> : (
            walletName &&
            <div className="get-started-last-log-lines">
              <div className="last-dcrwallet-log-line">{lastDcrwalletLogLine}</div>
            </div>
          )
        }
      </>
    </div>
  </div>
);

export default injectIntl(DaemonLoadingBody);
