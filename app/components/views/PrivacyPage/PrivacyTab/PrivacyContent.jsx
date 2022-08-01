import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { Subtitle, Log, Balance, SendTransaction } from "shared";
import {
  InfoDocModalButton,
  MixerPassphraseModalSwitch,
  MixerSettingsIconButton,
  DangerButton
} from "buttons";
import { classNames, Checkbox } from "pi-ui";
import { SendFromUnmixedAccountModal } from "modals";
import styles from "./PrivacyContent.module.css";
import sendFormStyles from "./SendForm.module.css";
import { useService } from "hooks";
import SendOutputRow from "./SendOutputRow";

const PrivacyContent = ({
  accountMixerError,
  isMixerDisabled,
  accountMixerRunning,
  stopAccountMixer,
  onStartMixerAttempt,
  logs,
  allowSendFromUnmixed,
  onToggleSendFromUnmixed,
  showingSendUnmixModal,
  showModal,
  onChangeCheckbox,
  changeAccount,
  defaultSpendingAccountDisregardMixedAccount,
  mixedAccountSpendableBalance,
  changeAccountSpendableBalance,
  getRunningIndicator,
  isAutoBuyerRunning,
  onDisableTicketAutoBuyer
}) => {
  const [expandedLogs, setExpandedLogs] = useState(false);
  const onHideLog = () => setExpandedLogs(false);
  const onShowLog = () => setExpandedLogs(true);
  const { walletService } = useService();

  return (
    <div className={styles.privacyContent}>
      <Subtitle
        title={<T id="privacy.coinMixer" m="StakeShuffle" />}
        className={classNames(styles.isRow)}
        children={
          <div className={classNames(styles.contentTitleButtonsArea)}>
            <InfoDocModalButton document="MixerIntroduction" draggable />
          </div>
        }
      />
      <div className={styles.mixerArea}>
        <div
          className={classNames(
            styles.mixerStatus,
            styles.isRow,
            (accountMixerRunning || isAutoBuyerRunning) && styles.running
          )}>
          {accountMixerRunning || isAutoBuyerRunning ? (
            isAutoBuyerRunning ? (
              <T id="privacy.autobuyerRunning" m="Autobuyer is running" />
            ) : (
              <T id="privacy.mixersIsRunning" m="Mixer is running" />
            )
          ) : (
            <T id="privacy.mixerIsNotRunning" m="Mixer is not running" />
          )}
        </div>
        <div className={classNames(styles.isRow, styles.balanceRow)}>
          <div
            className={classNames(
              styles.balanceContainer,
              styles.unmixedAccount,
              isMixerDisabled && styles.balanceError
            )}>
            {isMixerDisabled && <div className={styles.alertIcon} />}
            <Balance amount={changeAccountSpendableBalance} />
            <label>
              <T id="privacy.label.unmixed.balance" m="Unmixed Balance" />
            </label>
          </div>
          <div
            className={classNames(
              styles.privacyArrows,
              (accountMixerRunning || isAutoBuyerRunning) && styles.running
            )}
          />
          <div
            className={classNames(
              styles.balanceContainer,
              styles.mixedAccount
            )}>
            <Balance amount={mixedAccountSpendableBalance} />
            <label>
              <T id="privacy.label.mixed.balance" m="Mixed Balance" />
            </label>
          </div>
          <div className={styles.startButtonContrainer}>
            {accountMixerRunning || isAutoBuyerRunning ? (
              <DangerButton
                onClick={
                  isAutoBuyerRunning
                    ? onDisableTicketAutoBuyer
                    : stopAccountMixer
                }>
                {isAutoBuyerRunning ? (
                  <T id="privacy.stop.autobuyer" m="Stop Auto Buyer" />
                ) : (
                  <T id="privacy.stop.mixer" m="Stop Mixer" />
                )}
              </DangerButton>
            ) : getRunningIndicator ? (
              <Tooltip
                contentClassName={styles.disabledTooltip}
                content={
                  <T
                    id="mixer.start.running"
                    m="Privacy Mixer or Autobuyer running, please shut them off before purchasing a ticket."
                  />
                }>
                <MixerPassphraseModalSwitch
                  className={styles.startMixerButton}
                  disabled={true}
                  buttonLabel={<T id="privacy.start.mixer" m="Start Mixer" />}
                />
              </Tooltip>
            ) : (
              <MixerPassphraseModalSwitch
                modalTitle={
                  <T id="privacy.start.mixer.confirmation" m="Start Mixer" />
                }
                buttonLabel={<T id="privacy.start.mixer" m="Start Mixer" />}
                modalDescription={
                  <T
                    id="privacy.mixer.modal.description"
                    m={`Do you want to start the mixer?
                Decrediton should not be closed while the mixer is running.`}
                  />
                }
                disabled={isMixerDisabled}
                className={styles.startMixerButton}
                onSubmit={(passaphrase) => {
                  onShowLog();
                  onStartMixerAttempt(passaphrase);
                }}
              />
            )}
          </div>
        </div>
        <MixerSettingsIconButton className={styles.mixerSettingsIconButton} />
        {accountMixerError && (
          <div className={styles.error}>{accountMixerError}</div>
        )}
      </div>
      <SendFromUnmixedAccountModal
        show={showingSendUnmixModal}
        onSubmit={onToggleSendFromUnmixed}
        onCancelModal={() => showModal(false)}
      />
      {walletService && (
        <div className={styles.sendToUnmixedAccount}>
          <div className={styles.title}>
            <T
              id="privacy.sendToUnmixedAccount.title"
              m="Send to Unmixed Account"
            />
          </div>
          <SendTransaction
            onlySendSelfAllowed={true}
            styles={sendFormStyles}
            receiveAccountsSelectDisabled={true}
            hideDetails={true}
            sendButtonLabel={<T id="send.sendToSelfBtn" m="Send to Self" />}
            receiveAccount={changeAccount}
            spendingAccount={defaultSpendingAccountDisregardMixedAccount}
            filterFromAccounts={[changeAccount]}
            SendOutputRow={SendOutputRow}
          />
        </div>
      )}
      <Checkbox
        label={
          <T
            id="privacy.allowSendingFromUnmixedAccount"
            m="Allow sending from unmixed accounts"
          />
        }
        id="privacyCheckbox"
        data-testid="privacyCheckbox"
        checked={allowSendFromUnmixed}
        onChange={onChangeCheckbox}
      />
      <Log
        title={<T id="privacy.logs" m="Logs" />}
        log={logs}
        expanded={expandedLogs}
        onShowLog={onShowLog}
        onHideLog={onHideLog}
      />
    </div>
  );
};

export default PrivacyContent;
