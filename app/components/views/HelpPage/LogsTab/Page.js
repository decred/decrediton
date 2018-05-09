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
}
) => (
  <Aux>
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
  </Aux>
);

export default Logs;
