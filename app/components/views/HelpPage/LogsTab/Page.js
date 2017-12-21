import { FormattedMessage as T } from "react-intl";

const Logs = ({
  showDecreditonLogs,
  showDcrdLogs,
  showDcrwalletLogs,
  hideDecreditonLogs,
  hideDcrdLogs,
  hideDcrwalletLogs,
  dcrdLogs,
  dcrwalletLogs,
  decreditonLogs}
) => (
  <Aux>
    <div className="tab-card">
      {!dcrdLogs ?
        <div className="log-area-hidden" onClick={showDcrdLogs}>
          Show Dcrd Logs
        </div>:
        <div className="log-area-expanded">
          <div className="log-area-expanded-hide"  onClick={hideDcrdLogs}>
            Hide Dcrd Logs
          </div>
          <div className="log-area-logs">
            {dcrdLogs}
          </div>
        </div>
      }
      {!dcrwalletLogs ?
        <div className="log-area-hidden" onClick={showDcrwalletLogs}>
          Show Dcrwallet Logs
        </div>:
        <div className="log-area-expanded">
          <div className="log-area-expanded-hide"  onClick={hideDcrwalletLogs}>
            Hide Dcrwallet Logs
          </div>
          <div className="log-area-logs">
            <textarea rows="50" cols="140" value={dcrwalletLogs} disabled />
          </div>
        </div>
      }
      {!decreditonLogs ?
        <div className="log-area-hidden" onClick={showDecreditonLogs}>
          Show Decrediton Logs
        </div>:
        <div className="log-area-expanded">
          <div className="log-area-expanded-hide"  onClick={hideDecreditonLogs}>
            Hide Decrediton Logs
          </div>
          <div className="log-area-logs">
            {decreditonLogs}
          </div>
        </div>
      }
    </div>
  </Aux>
);

export default Logs;
