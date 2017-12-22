import { FormattedMessage as T } from "react-intl";

const Logs = ({
  showDcrdLogs,
  showDcrwalletLogs,
  hideDcrdLogs,
  hideDcrwalletLogs,
  dcrdLogs,
  dcrwalletLogs,
  }
) => (
  <Aux>
    <div className="tab-card">
      {!dcrdLogs ?
        <div className="log-area-hidden" onClick={showDcrdLogs}>
          <T id="help.logs.show.dcrd" m="Show dcrd logs" />
        </div>:
        <div className="log-area-expanded">
          <div className="log-area-expanded-hide"  onClick={hideDcrdLogs}>
            <T id="help.logs.hide.dcrd" m="Hide dcrd logs" />
          </div>
          <div className="log-area-logs">
            <textarea rows="30" cols="95" value={dcrdLogs} disabled />
          </div>
        </div>
      }
      {!dcrwalletLogs ?
        <div className="log-area-hidden" onClick={showDcrwalletLogs}>
          <T id="help.logs.show.dcrwallet" m="Show dcrwallet logs" />
        </div>:
        <div className="log-area-expanded">
          <div className="log-area-expanded-hide"  onClick={hideDcrwalletLogs}>
            <T id="help.logs.show.dcrwallet" m="Hide dcrwallet logs" />
          </div>
          <div className="log-area-logs">
            <textarea rows="30" cols="95" value={dcrwalletLogs} disabled />
          </div>
        </div>
      }
    </div>
  </Aux>
);

export default Logs;
