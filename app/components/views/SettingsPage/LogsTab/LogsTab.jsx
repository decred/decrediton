import { useState, useEffect, useCallback } from "react";
import { useLogging } from "./hooks";
import Logs from "./Page";
import {
  getDcrdLogs,
  getDcrwalletLogs,
  getDecreditonLogs,
  getDcrlndLogs
} from "wallet";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";

export const LogsTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="help.description.logs"
        m="Please find your current logs below to look for any issue or error you are having."
      />
    }
  />
);

const LogsTabBody = ({ setInterval, clearInterval }) => {
  const [interval, setIntervalState] = useState(null);
  const [dcrdLogs, setDcrdLogs] = useState("");
  const [dcrwalletLogs, setDcrwalletLogs] = useState("");
  const [decreditonLogs, setDecreditonLogs] = useState("");
  const [dcrlndLogs, setDcrlndLogs] = useState("");
  const [showDcrdLogs, setShowDcrdLogs] = useState(false);
  const [showDcrwalletLogs, setShowDcrwalletLogs] = useState(false);
  const [showDecreditonLogs, setShowDecreditonLogs] = useState(false);
  const [showDcrlndLogs, setShowDcrlndLogs] = useState(false);

  const {
    walletReady,
    isDaemonRemote,
    isDaemonStarted,
    lnActive,
    lnStartAttempt
  } = useLogging();

  const getLogs = useCallback(async () => {
    const [
      rawDcrdLogs,
      rawDcrwalletLogs,
      decreditonLogsNew,
      rawDcrlndLogs
    ] = await Promise.all([
      getDcrdLogs(),
      getDcrwalletLogs(),
      getDecreditonLogs(),
      getDcrlndLogs()
    ]);
    const dcrdLogsNew = Buffer.from(rawDcrdLogs).toString("utf8");
    const dcrwalletLogsNew = Buffer.from(rawDcrwalletLogs).toString("utf8");
    const dcrlndLogsNew = Buffer.from(rawDcrlndLogs).toString("utf8");
    if (dcrdLogsNew !== dcrdLogs) {
      setDcrdLogs(dcrdLogsNew);
    }
    if (dcrwalletLogsNew !== dcrwalletLogs) {
      setDcrwalletLogs(dcrwalletLogsNew);
    }
    if (decreditonLogsNew !== decreditonLogs) {
      setDecreditonLogs(decreditonLogsNew);
    }
    if (dcrlndLogsNew !== dcrlndLogs) {
      setDcrlndLogs(dcrlndLogsNew);
    }
  }, [decreditonLogs, dcrwalletLogs, dcrdLogs, dcrlndLogs]);

  useEffect(() => {
    if (interval) {
      return;
    }
    getLogs();
    const int = setInterval(() => getLogs(), 2000);
    setIntervalState(int);

    return () => {
      clearInterval(interval);
    };
  }, [setInterval, interval, setIntervalState, clearInterval, getLogs]);

  const onShowDecreditonLogs = () => setShowDecreditonLogs(true);

  const onHideDecreditonLogs = () => setShowDecreditonLogs(false);

  const onShowDcrdLogs = () => setShowDcrdLogs(true);

  const onHideDcrdLogs = () => setShowDcrdLogs(false);

  const onShowDcrwalletLogs = () => setShowDcrwalletLogs(true);

  const onHideDcrwalletLogs = () => setShowDcrwalletLogs(false);

  const onShowDcrlndLogs = () => setShowDcrlndLogs(true);

  const onHideDcrlndLogs = () => setShowDcrlndLogs(false);

  return (
    <Logs
      {...{
        walletReady,
        isDaemonRemote,
        isDaemonStarted,
        lnActive,
        lnStartAttempt,
        dcrdLogs,
        dcrwalletLogs,
        decreditonLogs,
        dcrlndLogs,
        showDcrdLogs,
        showDcrwalletLogs,
        showDecreditonLogs,
        showDcrlndLogs,
        onShowDecreditonLogs,
        onShowDcrdLogs,
        onShowDcrwalletLogs,
        onShowDcrlndLogs,
        onHideDecreditonLogs,
        onHideDcrdLogs,
        onHideDcrwalletLogs,
        onHideDcrlndLogs
      }}
    />
  );
};

export const LogsTab = ReactTimeout(LogsTabBody);
