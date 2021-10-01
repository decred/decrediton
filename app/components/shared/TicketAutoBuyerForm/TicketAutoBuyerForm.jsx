import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { AutoBuyerSettingsModal } from "modals";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "./TicketAutoBuyerForm.module.css";

const TicketAutoBuyerForm = ({
  onStartAutoBuyer,
  onStopAutoBuyer,
  isRunning,
  isGetVSPAttempt,
  isValidationInProgress,
  balanceToMaintain,
  setBalanceToMaintain,
  account,
  setAccount,
  vsp,
  vspHost,
  isValid,
  errorMsg,
  clicked,
  onValidate,
  notMixedAccounts,
  getRunningIndicator,
  onSaveAutoBuyerSettings,
  isSettingsModalVisible,
  showSettingsModal,
  hideSettingsModal,
  VSPSelectControl,
  maxFeePercentage,
  setMaxFeePercentage
}) => (
  <>
    <div className={styles.wrapper}>
      <div>
        {isRunning ? (
          <AutoBuyerSwitch
            enabled
            onClick={onStopAutoBuyer}
            className={styles.toggleSwitch}
          />
        ) : getRunningIndicator ? (
          <AutoBuyerPassphraseModalSwitch
            className={styles.toggleSwitch}
            tooltipClassName={styles.disabledTooltip}
            disabledText={
              <T
                id="tickets.autobuyer.running"
                m="Privacy Mixer or Purchase Ticket Attempt running, please shut them off before starting autobuyer."
              />
            }
            disabled={true}
          />
        ) : (
          <AutoBuyerPassphraseModalSwitch
            className={styles.toggleSwitch}
            modalTitle={
              <T
                id="vsp.tickets.startAutoBuyerConfirmation"
                m="Start Ticket Buyer Confirmation"
              />
            }
            modalDescription={
              <div>
                <span className={styles.orangeWarning}>
                  <T
                    id="vsp.tickets.startAutoBuyerConfirmation.attention"
                    m="Attention!"
                  />
                </span>
                <T
                  id="vsp.tickets.startAutoBuyerConfirmation.description"
                  m="Decrediton must remain running for tickets to be automatically purchased."
                />
                <div>
                  <div className={styles.isRow}>
                    <div className={styles.confirmLabel}>
                      <T
                        id="vsp.autobuyer.modal.balanceToMaintain"
                        m="Balance To Maintain"
                      />
                      :
                    </div>
                    <div>
                      <Balance flat amount={balanceToMaintain?.atomValue} />
                    </div>
                  </div>
                  <div className={styles.isRow}>
                    <div className={styles.confirmLabel}>
                      <T id="vsp.autobuyer.modal.stakepool" m="VSP" />:
                    </div>
                    <div>{vspHost && vspHost}</div>
                  </div>
                </div>
              </div>
            }
            loading={
              !isSettingsModalVisible &&
              isValidationInProgress &&
              isGetVSPAttempt
            }
            onSubmit={onStartAutoBuyer}
            onValidate={onValidate}
          />
        )}
      </div>
      <div className={styles.subtitle}>
        <T id="vsp.autobuyer.subtitle" m="Automatic Ticket Purchases" />
      </div>
      <button
        aria-label="Ticket Autobuyer Settings"
        disabled={isRunning || isGetVSPAttempt}
        className={styles.settingsButton}
        onClick={showSettingsModal}
      />
      <AutoBuyerSettingsModal
        {...{
          show: isSettingsModalVisible,
          onSubmit: onSaveAutoBuyerSettings,
          onCancelModal: hideSettingsModal,
          balanceToMaintain,
          setBalanceToMaintain,
          account,
          setAccount,
          isGetVSPAttempt,
          vsp,
          notMixedAccounts,
          isValid,
          errorMsg,
          clicked,
          VSPSelectControl,
          maxFeePercentage,
          setMaxFeePercentage
        }}
      />
    </div>
  </>
);

export default TicketAutoBuyerForm;
