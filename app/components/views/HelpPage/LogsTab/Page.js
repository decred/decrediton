import { FormattedMessage as T } from "react-intl";
import "style/Logs.less";

const Logs = ({
  showDcrdLogs,
  showDcrwalletLogs,
  hideDcrdLogs,
  hideDcrwalletLogs,
  dcrdLogs,
  dcrwalletLogs,
  remoteDcrd,
  walletReady,
}
) => (
  <Aux>
    {!remoteDcrd ?
      !dcrdLogs ?
        <div className="log-area hidden">
          <div className="log-area-title hidden" onClick={showDcrdLogs}>
            <T id="help.logs.dcrd" m="dcrd" />
          </div>
        </div>:
        <div className="log-area expanded">
          <div className="log-area-title expanded" onClick={hideDcrdLogs}>
            <T id="help.logs.dcrd" m="dcrd" />
          </div>
          <div className="log-area-logs">
            <textarea value={dcrdLogs} disabled />
          </div>
        </div> :
      <div/>
    }
    {!walletReady ? null : !dcrwalletLogs ?
      <div className="log-area hidden">
        <div className="log-area-title hidden" onClick={showDcrwalletLogs}>
          <T id="help.logs.dcrwallet" m="dcrwallet" />
        </div>
      </div>:
      <div className="log-area expanded">
        <div className="log-area-title expanded" onClick={hideDcrwalletLogs}>
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
