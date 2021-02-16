import { LinearProgressSmall } from "indicators";
import { useRescan } from "hooks";
import { FormattedMessage as T } from "react-intl";
import { RescanButton, RescanCancelButton } from "buttons";
import styles from "./RescanProgress.module.css";

const RescanProgress = () => {
  const {
    rescanEndBlock,
    rescanCurrentBlock,
    rescanPercentFinished,
    rescanRequest,
    rescanCancel
  } = useRescan();

  return (
    <div className={styles.rescanProgressArea}>
      <div className={styles.rescanProgressIndicator}>
        <LinearProgressSmall
          min={0}
          max={1}
          value={rescanCurrentBlock / rescanEndBlock}
          className={styles.linearProgressSmall}
          barClassName={styles.linearProgressSmallBar}
        />
      </div>
      <RescanButton {...{ rescanRequest }} />
      <T
        id="rescan.rescanning"
        m="Rescanning {blockProgress} ({progressPercent})"
        values={{
          blockProgress: (
            <span className={styles.rescanProgressFraction}>
              {rescanCurrentBlock}/{rescanEndBlock}
            </span>
          ),
          progressPercent: (
            <span className={styles.rescanProgressPercent}>
              <T
                id="rescan.progressPercent"
                m="{progress, number, percent}"
                values={{ progress: rescanPercentFinished / 100 }}
              />
            </span>
          )
        }}
      />
      <div className={styles.rescanCancelButtonArea}>
        <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
      </div>
    </div>
  );
};

export default RescanProgress;
