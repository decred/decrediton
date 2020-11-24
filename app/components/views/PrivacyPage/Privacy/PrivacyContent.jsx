import { useState, useEffect } from "react";
import { FormattedMessage as T } from "react-intl";
import { Subtitle, Log, Balance } from "shared";
import {
  InfoDocModalButton,
  MixerPassphraseModalSwitch,
  MixerSettingsIconButton,
  DangerButton
} from "buttons";
import { classNames, Checkbox } from "pi-ui";
import { SendFromUnmixedAccountModal } from "modals";
import style from "./Privacy.module.css";
import { SendTransaction } from "shared";
import styles from "./SendForm.module.css";
import { useService } from "hooks";

const PrivacyContent = ({
  accountMixerError,
  accountMixerRunning,
  stopAccountMixer,
  onStartMixerAttempt,
  logs,
  allowSendFromUnmixed,
  onToggleSendFromUnmixed,
  showingSendUnmixModal,
  showModal,
  onChangeCheckbox,
  mixedAccount,
  changeAccount,
  showInsufficientBalanceWarning,
  defaultSpendingAccountDisregardMixedAccount,
  getMixerAcctsSpendableBalances,
  mixedAccountSpendableBalance,
  changeAccountSpendableBalance,
  hasChangeAccountEnoughFunds,
  accounts
}) => {
  const [expandedLogs, setExpandedLogs] = useState(false);
  const onHideLog = () => setExpandedLogs(false);
  const onShowLog = () => setExpandedLogs(true);
  const [showBalanceError, setShowBalanceError] = useState(false);
  const isStartMixerBtnEnabled = hasChangeAccountEnoughFunds;
  const onShowInsufficientBalanceWarning = () => {
    showInsufficientBalanceWarning();
    setShowBalanceError(true);
  };
  const mixedAccountObject = accounts[mixedAccount];
  const changeAccountObject = accounts[changeAccount];
  useEffect(() => {
    getMixerAcctsSpendableBalances();
  }, [
    getMixerAcctsSpendableBalances,
    mixedAccount,
    changeAccount,
    mixedAccountObject.spendable,
    changeAccountObject.spendable
  ]);

  const { walletService } = useService();
  return (
    <div className={style.privacyContent}>
      <Subtitle
        title={<T id="privacy.coinMixer" m="Coin Mixer" />}
        className={classNames(style.isRow)}
        children={
          <div className={classNames(style.contentTitleButtonsArea)}>
            <InfoDocModalButton document="MixerIntroduction" draggable />
          </div>
        }
      />
      <div className={style.mixerArea}>
        <div
          className={classNames(
            style.mixerStatus,
            style.isRow,
            accountMixerRunning && style.running
          )}>
          {accountMixerRunning ? (
            <T id="privacy.mixersIsRunning" m="Mixer is running" />
          ) : (
            <T id="privacy.mixerIsNotRunning" m="Mixer is not running" />
          )}
        </div>
        <div className={classNames(style.isRow, style.balanceRow)}>
          <div
            className={classNames(
              style.balanceContainer,
              style.unmixedAccount,
              showBalanceError && style.balanceError
            )}>
            {showBalanceError && <div className={style.alertIcon} />}
            <Balance amount={changeAccountSpendableBalance} />
            <label>
              <T id="privacy.label.unmixed.balance" m="Unmixed Balance" />
            </label>
          </div>
          <div
            className={classNames(
              style.privacyArrows,
              accountMixerRunning && style.running
            )}
          />
          <div
            className={classNames(style.balanceContainer, style.mixedAccount)}>
            <Balance amount={mixedAccountSpendableBalance} />
            <label>
              <T id="privacy.label.mixed.balance" m="Mixed Balance" />
            </label>
          </div>
          <div className={style.startButtonContrainer}>
            {accountMixerRunning ? (
              <DangerButton onClick={stopAccountMixer}>
                <T id="privacy.stop.mixer" m="Stop Mixer" />
              </DangerButton>
            ) : (
              <div
                onClick={() =>
                  !isStartMixerBtnEnabled && onShowInsufficientBalanceWarning()
                }>
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
                  disabled={!isStartMixerBtnEnabled}
                  className={style.startMixerButton}
                  onSubmit={(passaphrase) => {
                    onShowLog();
                    onStartMixerAttempt(passaphrase);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <MixerSettingsIconButton className={style.mixerSettingsIconButton} />
      </div>
      {accountMixerError && (
        <div className={style.error}>{accountMixerError}</div>
      )}
      <SendFromUnmixedAccountModal
        show={showingSendUnmixModal}
        onSubmit={onToggleSendFromUnmixed}
        onCancelModal={() => showModal(false)}
      />
      {walletService && (
        <div className={style.sendToUnmixedAccount}>
          <div className={style.title}>
            <T
              id="privacy.sendToUnmixedAccount.title"
              m="Send To Unmixed Account"
            />
          </div>
          <SendTransaction
            onlySendSelfAllowed={true}
            styles={styles}
            receiveAccountsSelectDisabled={true}
            hideDetails={true}
            sendButtonLabel={<T id="send.sendToSelfBtn" m="Send to Self" />}
            receiveAccount={changeAccount}
            spendingAccount={defaultSpendingAccountDisregardMixedAccount}
          />
        </div>
      )}
      <Checkbox
        label={
          <T
            id="privacy.allowSendingFromUnmixedAccount"
            m="Allow sending from unmixed account"
          />
        }
        id="privacyCheckbox"
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
