import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
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
  lnActive,
  lnConnectAttempt,
  lnStartAttempt,
  dcrlndLogs,
  showDcrlndLogs,
  onShowDcrlndLogs,
  onHideDcrlndLogs
}
) => (
  <>
    <Subtitle title={<T id="logs.subtitle" m="System Logs"/>} />
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
    {(!lnActive && !lnConnectAttempt && !lnStartAttempt) ? null : !showDcrlndLogs ?
      <div className="log-area hidden">
        <div className="log-area-title hidden" onClick={onShowDcrlndLogs}>
          <T id="help.logs.dcrlnd" m="dcrlnd" />
        </div>
      </div>:
      <div className="log-area expanded">
        <div className="log-area-title expanded" onClick={onHideDcrlndLogs}>
          <T id="help.logs.dcrlnd" m="dcrlnd" />
        </div>
        <div className="log-area-logs">
          <textarea rows="30" value={dcrlndLogs} disabled />
        </div>
      </div>
    }

  </>
);

export default Logs;
