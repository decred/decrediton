import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg } from "../messages";
import { Documentation } from "shared";
import cx from "classnames";

export default ({
  onHideReleaseNotes,
  onShowSettings,
  onShowLogs,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getWalletReady,
  getDaemonStarted,
  isDaemonRemote,
  version,
  docName,
  imgClassName,
  onNewerVersion,
  onOlderVersion,
  isTestNet
}) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted loader logs">
      <div className="content-title">
        <div className="loader-settings-logs">
          <>
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
          </>
        </div>
        <div className="go-back-screen-button-area">
          <Tooltip text={ <T id="releaseNotes.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onHideReleaseNotes}/></Tooltip>
        </div>
        <T id="getStarted.releaseNotesTitle" m="Decrediton v{version} Released" values={{ version }}/>
        <div className="release-notes-version-navigation">
          <a href="#" onClick={onNewerVersion}><T id="getStarted.releaseNotes.NewerVersion" m="Newer Version"/></a>
          <a href="#" onClick={onOlderVersion}><T id="getStarted.releaseNotes.OlderVersion" m="Older Version"/></a>
        </div>
      </div>
      <div className="release-notes">
        <Documentation name={docName} className="release-notes-text" />
        <div className={[ "release-notes-image", imgClassName ].join(" ")} />
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
