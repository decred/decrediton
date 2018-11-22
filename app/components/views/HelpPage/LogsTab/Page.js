import { FormattedMessage as T } from "react-intl";
import "style/Logs.less";

const Logs = ({
  showDcrdLogs,
  showDcrwalletLogs,
  onShowDcrdLogs,
  onShowDcrwalletLogs,
  onHideDcrdLogs,
  onHideDcrwalletLogs,
  dcrdLogs,
  dcrwalletLogs,
  isDaemonRemote,
  isDaemonStarted,
  walletReady,
  decreditonLogs,
  showDecreditonLogs,
  onShowDecreditonLogs,
  onHideDecreditonLogs,
}
) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="logs.subtitle" m="System Logs"/></div>
    {!isDaemonRemote && isDaemonStarted ?
      !showDcrdLogs ?
        <div className="log-area hidden">
          <div className="log-area-title hidden" onClick={onShowDcrdLogs}>
            <T id="help.logs.dcrd" m="dcrd" />
          </div>
        </div>:
        <div className="log-area expanded">
          <div className="log-area-title expanded" onClick={onHideDcrdLogs}>
            <T id="help.logs.dcrd" m="dcrd" />
          </div>
          <div className="log-area-logs">
            <textarea rows="30" value={dcrdLogs} disabled />
          </div>
        </div> :
      <div/>
    }
    {!walletReady ? null : !showDcrwalletLogs ?
      <div className="log-area hidden">
        <div className="log-area-title hidden" onClick={onShowDcrwalletLogs}>
          <T id="help.logs.dcrwallet" m="dcrwallet" />
        </div>
      </div>:
      <div className="log-area expanded">
        <div className="log-area-title expanded" onClick={onHideDcrwalletLogs}>
          <T id="help.logs.dcrwallet" m="dcrwallet" />
        </div>
        <div className="log-area-logs">
          <textarea rows="30" value={dcrwalletLogs} disabled />
        </div>
      </div>
    }
    {!showDecreditonLogs ?
      <div className="log-area hidden">
        <div className="log-area-title hidden" onClick={onShowDecreditonLogs}>
          <T id="help.logs.decrediton" m="decrediton" />
        </div>
      </div>:
      <div className="log-area expanded">
        <div className="log-area-title expanded" onClick={onHideDecreditonLogs}>
          <T id="help.logs.decrediton" m="decrediton" />
        </div>
        <div className="log-area-logs">
          <textarea rows="30" value={decreditonLogs} disabled />
        </div>
      </div>
    }
  </Aux>
);

export default Logs;
