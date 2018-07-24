import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { AboutModalButtonInvisible } from "buttons";

export default ({
  onHideTrezorConfig,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  appVersion,
  updateAvailable,
  children,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader">
      <div className="content-title">
        <div className="loader-settings-logs">
          <AboutModalButtonInvisible version={appVersion} updateAvailable={updateAvailable} buttonLabel={<T id="help.about" m="About Decrediton" />}/>
        </div>
        <div className="go-back-screen-button-area">
          <Tooltip text={ <T id="logs.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onHideTrezorConfig}/></Tooltip>
        </div>
      </div>

      <div className="getstarted-trezor-config-sections">
        {children}
      </div>

      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
