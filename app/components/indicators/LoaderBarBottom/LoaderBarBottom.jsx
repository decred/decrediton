import { FormattedMessage as T } from "react-intl";
import { LinearProgressSmall } from "indicators";
import { FormattedRelative } from "shared";
import styles from "./LoaderBarBottom.module.css";

const LoaderBarBottom = ({
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced
}) => {
  let finishDateEstimation = null;
  if (getEstimatedTimeLeft !== null) {
    finishDateEstimation = new Date();
    finishDateEstimation.setSeconds(
      finishDateEstimation.getSeconds() + getEstimatedTimeLeft
    );
  }
  return getCurrentBlockCount && !getDaemonSynced ? (
    <div className={styles.barBottom}>
      <div className={styles.barEstimation}>
        <span>
          {finishDateEstimation ? (
            <T
              id="getStarted.chainLoading.syncEstimation.small"
              m="Loading Decred blockchain, completion estimated"
            />
          ) : null}
        </span>
        <span className={styles.bold}>
          {" "}
          {finishDateEstimation ? (
            <FormattedRelative value={finishDateEstimation} />
          ) : null}{" "}
          ({getCurrentBlockCount} / {getNeededBlocks})
        </span>
      </div>
      <LinearProgressSmall
        min={0}
        max={getNeededBlocks}
        value={getCurrentBlockCount}
      />
    </div>
  ) : (
    <div />
  );
};

export default LoaderBarBottom;
