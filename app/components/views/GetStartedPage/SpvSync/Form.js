import { AnimatedLinearProgressFull } from "indicators";
import { injectIntl } from "react-intl";
import { FormattedRelative } from "shared";
import { KeyBlueButton, SlateGrayButton, InvisibleButton } from "buttons";
import { PasswordInput } from "inputs";
import { LogsLinkMsg, SettingsLinkMsg, HeaderTimeMsg, DiscoverLabelMsg,
  DiscoverAccountsInfoMsg, ScanBtnMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton, messages } from "../messages";
import "style/GetStarted.less";
import cx from "classnames";

const SpvSyncBody = ({
  text,
  animationType,
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
  hasAttemptedDiscover,
  Form,
  syncFetchHeadersAttempt,
  syncFetchHeadersComplete,
  isTestNet,
  ...props
}) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted loader">
      <>
        <div className="content-title">
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
                <HeaderTimeMsg />
                <span className="bold"> {syncFetchHeadersLastHeaderTime ? <FormattedRelative value={syncFetchHeadersLastHeaderTime}/> : "--" }</span>
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
        {Form && <Form {...props}/>}
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
              <KeyBlueButton onClick={onSpvSync} disabled={!passPhrase}>
                <ScanBtnMsg />
              </KeyBlueButton>
            </div>
          </div> :
          <div className="get-started-last-log-lines">
            <div className="last-dcrwallet-log-line">{lastDcrwalletLogLine}</div>
          </div>
        }
      </>
    </div>
  </div>
);

export default injectIntl(SpvSyncBody);
