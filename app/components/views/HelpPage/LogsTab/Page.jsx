import { FormattedMessage as T } from "react-intl";
import { Subtitle, Log } from "shared";

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
  walletReady,
  decreditonLogs,
  showDecreditonLogs,
  onShowDecreditonLogs,
  onHideDecreditonLogs,
  lnActive,
  lnStartAttempt,
  dcrlndLogs,
  showDcrlndLogs,
  onShowDcrlndLogs,
  onHideDcrlndLogs
}) => (
  <>
    <Subtitle title={<T id="logs.subtitle" m="System Logs" />} />
    {!isDaemonRemote && (
      <Log
        title={<T id="help.logs.dcrd" m="dcrd" />}
        log={dcrdLogs}
        expanded={showDcrdLogs}
        onShowLog={onShowDcrdLogs}
        onHideLog={onHideDcrdLogs}
      />
    )}
    {walletReady && (
      <Log
        title={<T id="help.logs.dcrwallet" m="dcrwallet" />}
        log={dcrwalletLogs}
        expanded={showDcrwalletLogs}
        onShowLog={onShowDcrwalletLogs}
        onHideLog={onHideDcrwalletLogs}
      />
    )}
    <Log
      title={<T id="help.logs.decrediton" m="decrediton" />}
      log={decreditonLogs}
      expanded={showDecreditonLogs}
      onShowLog={onShowDecreditonLogs}
      onHideLog={onHideDecreditonLogs}
    />
    {lnActive ||
      (lnStartAttempt && (
        <Log
          title={<T id="help.logs.dcrlnd" m="dcrlnd" />}
          expanded={showDcrlndLogs}
          onShowLog={onShowDcrlndLogs}
          onHideLog={onHideDcrlndLogs}
          log={dcrlndLogs}
        />
      ))}
  </>
);

export default Logs;
