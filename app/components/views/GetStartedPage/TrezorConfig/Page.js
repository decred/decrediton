import { Tooltip } from "shared";
import { LoaderBarBottom } from "indicators";
import { AboutModalButton, GoBackMsg } from "../messages";
import cx from "classnames";

export default ({
  onHideTrezorConfig,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  appVersion,
  updateAvailable,
  children,
  isTestNet
}) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted loader">
      <div className="content-title">
        <div className="loader-settings-logs">
          <AboutModalButton version={appVersion} updateAvailable={updateAvailable} />
        </div>
        <div className="go-back-screen-button-area">
          <Tooltip text={ <GoBackMsg /> }><div className="go-back-screen-button" onClick={onHideTrezorConfig}/></Tooltip>
        </div>
      </div>

      <div className="getstarted-trezor-config-sections">
        {children}
      </div>

      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
