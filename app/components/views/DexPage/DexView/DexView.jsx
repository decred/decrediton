import { FormattedMessage as T } from "react-intl";
import { useDex } from "../hooks";
import { KeyBlueButton } from "buttons";
import { useMountEffect } from "hooks";
import { useState } from "react";
import { Log } from "shared";;
import { Documentation } from "shared";

export const DexView = () => {
  const { onLaunchDexWindow, onGetDexLogs } = useDex();

  const [logs, setLogs] = useState("");
  const [expandedLogs, setExpandedLogs] = useState(false);
  const onHideLog = () => setExpandedLogs(false);
  const onShowLog = () => setExpandedLogs(true);

  useMountEffect(() => {
    // get initial logs
    onGetDexLogs()
      .then((dexLogs) => setLogs(dexLogs.toString("utf-8")))
      .catch((err) => err);

    const dexInterval = setInterval(async () => {
      try {
        const dexLogs = await onGetDexLogs();
        setLogs(dexLogs.toString("utf-8"));
      } catch (err) {
        console.log(err);
      }
    }, 2000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(dexInterval);
    };
  });

  return (
    <div>
      <Documentation name={"DexNotes"} />
      <KeyBlueButton onClick={onLaunchDexWindow}>
        <T id="dex.launchDexWindow" m="Launch DEX Window" />
      </KeyBlueButton>
      <Log
        title={<T id="dex.logs" m="Logs" />}
        log={logs}
        expanded={expandedLogs}
        onShowLog={onShowLog}
        onHideLog={onHideLog}
      />
    </div>
  );
};

export default DexView;
