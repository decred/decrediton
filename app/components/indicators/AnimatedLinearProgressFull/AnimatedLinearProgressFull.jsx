import { useState, useCallback } from "react";
import { useDaemonStartup, useMountEffect } from "hooks";
import { HeaderTimeMsg } from "views/GetStartedPage/messages";
import { FormattedRelative } from "shared";
import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";
import { classNames, Tooltip } from "pi-ui";
import styles from "./AnimatedLinearProgressFull.module.css";
import { useRescan } from "hooks";
import { KeyBlueButton } from "buttons";
import { AutoWalletLaunchingModal } from "modals";

const AnimatedLinearProgressFull = ({
  setInterval,
  min,
  error,
  text,
  animationType,
  initialAnimationType,
  hideTextBlock,
  onCancelLoadingWallet,
  onContinueOpeningWallet,
  onSaveAndContinueOpeningWallet,
  nextStateAfterWalletLoading,
  hideOpenWalletButton
}) => {
  const {
    isSPV,
    getNeededBlocks,
    getEstimatedTimeLeft,
    selectedWalletSelector,
    getCurrentBlockCount,
    syncFetchHeadersLastHeaderTime,
    syncFetchHeadersFirstHeaderTime,
    getDcrwalletLogs,
    getDaemonSynced,
    onGetDcrdLogs,
    syncRescanAttempt,
    startWalletServiceAttempt,
    synced
  } = useDaemonStartup();
  const { rescanEndBlock, rescanStartBlock, rescanCurrentBlock } = useRescan();
  const [lastDcrwalletLogLine, setLogLine] = useState("");
  const [lastDcrdLogLine, setDcrdLogLine] = useState("");
  const [
    isAutoWalletLaunchingModalVisible,
    setIsAutoWalletLaunchingModalVisible
  ] = useState(false);
  const showAutoWalletLaunchingModalVisible = useCallback(
    () => setIsAutoWalletLaunchingModalVisible(true),
    [setIsAutoWalletLaunchingModalVisible]
  );

  useMountEffect(() => {
    setInterval(async () => {
      try {
        const lastDcrwalletLogLine = await getDcrwalletLogs();
        setLogLine(lastDcrwalletLogLine);
      } catch (err) {
        console.log(err);
      }
    }, 2000);
    setInterval(async () => {
      try {
        const lastDcrdLogLine = await onGetDcrdLogs();
        setDcrdLogLine(lastDcrdLogLine);
      } catch (err) {
        console.log(err);
      }
    }, 2000);
  }, [setInterval, getDcrwalletLogs, onGetDcrdLogs]);

  const now = Date.now();
  let perComplete;
  if (!getDaemonSynced && getCurrentBlockCount) {
    perComplete = (getCurrentBlockCount - min) / (getNeededBlocks - min);
  } else if (syncRescanAttempt && rescanCurrentBlock) {
    perComplete =
      (rescanCurrentBlock - rescanStartBlock) /
      (rescanEndBlock - rescanStartBlock);
  } else if (syncFetchHeadersLastHeaderTime) {
    const syncFetchHeadersLastHeaderTimeTs = new Date(
      syncFetchHeadersLastHeaderTime
    ).getTime();
    const syncFetchHeadersFirstHeaderTimeTs = new Date(
      syncFetchHeadersFirstHeaderTime
    ).getTime();
    perComplete =
      (syncFetchHeadersLastHeaderTimeTs - syncFetchHeadersFirstHeaderTimeTs) /
      (now - syncFetchHeadersFirstHeaderTimeTs);
  }

  const leftStartingPoint = perComplete ? perComplete * 100 : 0;
  let finishDateEstimation = null;
  if (getEstimatedTimeLeft !== null) {
    finishDateEstimation = new Date();
    finishDateEstimation.setSeconds(
      finishDateEstimation.getSeconds() + getEstimatedTimeLeft
    );
  }

  return (
    <div className={classNames(styles.linearProgress)}>
      <div>
        {perComplete > 0 && (
          <div
            className={classNames(
              styles.linearProgressBar,
              error && styles.error
            )}
            style={
              error || !perComplete
                ? {}
                : { width: `${perComplete * 100}` + "%" }
            }
          />
        )}
        <div className={classNames(styles.linearProgressText)}>
          {selectedWalletSelector?.value?.wallet &&
            `${selectedWalletSelector.value.wallet} - `}
          {text}
        </div>
        {getCurrentBlockCount && !getDaemonSynced && (
          <div className={styles.loaderBarEstimation}>
            <T
              id="getStarted.chainLoading.syncEstimation"
              m="Blockchain download estimated complete: "
            />
            <span className={styles.bold}>
              {finishDateEstimation && (
                <FormattedRelative value={finishDateEstimation} />
              )}
              ({getCurrentBlockCount} / {getNeededBlocks})
            </span>
          </div>
        )}
        {syncRescanAttempt && rescanCurrentBlock ? (
          <div className={styles.loaderBarEstimation}>
            <T
              id="getStarted.walletRescan.progress"
              m="Rescan Progress ({rescanCurrentBlock} / {rescanEndBlock})"
              values={{
                rescanCurrentBlock:
                  rescanCurrentBlock > rescanStartBlock
                    ? rescanCurrentBlock
                    : rescanStartBlock,
                rescanEndBlock: rescanEndBlock
              }}
            />
          </div>
        ) : startWalletServiceAttempt ? (
          <div className={styles.loaderBarEstimation}>
            <T id="getStarted.startwalletservice" m="Start wallet services" />
          </div>
        ) : (
          selectedWalletSelector &&
          !synced &&
          syncFetchHeadersLastHeaderTime && (
            <div className={styles.loaderBarEstimation}>
              <HeaderTimeMsg />
              <span className={styles.bold}>
                <FormattedRelative value={syncFetchHeadersLastHeaderTime} />
              </span>
            </div>
          )
        )}
      </div>
      <div className={styles.icons}>
        {isSPV && (
          <div>
            <Tooltip
              placement="top"
              content={<T id="getstarted.spvMode" m="SPV Mode" />}>
              <div className={styles.spvIcon} />
            </Tooltip>
          </div>
        )}
        <div
          className={classNames(
            styles.icon,
            animationType ?? animationType,
            leftStartingPoint == 0 && initialAnimationType,
            leftStartingPoint == 0 && styles.initial
          )}
        />
      </div>
      <div>
        {!hideOpenWalletButton &&
          selectedWalletSelector &&
          (nextStateAfterWalletLoading ? (
            <>
              <KeyBlueButton
                onClick={showAutoWalletLaunchingModalVisible}
                className={styles.openWalletButton}>
                <T id="getstarted.openWallet" m="Open Wallet" />
              </KeyBlueButton>
              <AutoWalletLaunchingModal
                {...{
                  show: isAutoWalletLaunchingModalVisible,
                  onSubmit: onSaveAndContinueOpeningWallet,
                  onCancelModal: onContinueOpeningWallet
                }}
              />
            </>
          ) : (
            !startWalletServiceAttempt && (
              <KeyBlueButton
                onClick={onCancelLoadingWallet}
                className={styles.cancelLoadingButton}>
                <T id="getstarted.cancelLoading" m="Cancel Loading" />
              </KeyBlueButton>
            )
          ))}
      </div>
      {!hideTextBlock && (
        <div>
          {!getDaemonSynced && lastDcrdLogLine && !selectedWalletSelector && (
            <div className={styles.lastLogLines}>
              <div>{lastDcrdLogLine}</div>
            </div>
          )}
          {selectedWalletSelector && lastDcrwalletLogLine && (
            <div className={styles.lastLogLines}>
              <div>{lastDcrwalletLogLine}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReactTimeout(AnimatedLinearProgressFull);
