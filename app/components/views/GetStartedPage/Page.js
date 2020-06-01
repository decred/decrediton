import { InvisibleButton } from "buttons";
import {
  LogsLinkMsg,
  SettingsLinkMsg,
  UpdateAvailableLink,
  AboutModalButton
} from "./messages";
import { LoaderBarBottom } from "indicators";
import cx from "classnames";
import "style/GetStarted.less";

const DaemonLoadingBody = ({
  PageComponent,
  updateAvailable,
  appVersion,
  onShowLogs,
  onShowSettings,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  isTestNet
}) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted loader">
      <div className="loader-settings-logs">
        {updateAvailable && (
          <UpdateAvailableLink updateAvailable={updateAvailable} />
        )}
        <>
          <AboutModalButton {...{ appVersion, updateAvailable }} />
          <InvisibleButton onClick={onShowSettings}>
            <SettingsLinkMsg />
          </InvisibleButton>
          <InvisibleButton onClick={onShowLogs}>
            <LogsLinkMsg />
          </InvisibleButton>
        </>
      </div>
      {PageComponent &&
        (React.isValidElement(PageComponent) ? (
          PageComponent
        ) : (
          <PageComponent />
        ))}
      <LoaderBarBottom
        {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}
      />
    </div>
  </div>
);

export default DaemonLoadingBody;
