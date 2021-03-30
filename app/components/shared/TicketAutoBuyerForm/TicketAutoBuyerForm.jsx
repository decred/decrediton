import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { AutoBuyerSettingsModal } from "modals";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { Balance } from "shared";
import styles from "./TicketAutoBuyerForm.module.css";

const TicketAutoBuyerForm = ({
  onStartAutoBuyer,
  onStopAutoBuyer,
  isRunning,
  balanceToMaintain,
  setBalanceToMaintain,
  account,
  setAccount,
  vsp,
  vspHost,
  isValid,
  clicked,
  onClick,
  notMixedAccounts,
  getRunningIndicator,
  onSaveAutoBuyerSettings,
  isSettingsModalVisible,
  showSettingsModal,
  hideSettingsModal,
  VSPSelectControl
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
          <Tooltip
            content={
              <T
                id="tickets.autobuyer.running"
                m="Privacy Mixer or Purchase Ticket Attempt running, please shut them off before starting autobuyer."
              />
            }>
            <AutoBuyerPassphraseModalSwitch
              className={styles.toggleSwitch}
              disabled={true}
            />
          </Tooltip>
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
            onSubmit={onStartAutoBuyer}
            onClick={onClick}
            isValid={!!isValid}
          />
        )}
      </div>
      <div className={styles.subtitle}>
        <T id="vsp.autobuyer.subtitle" m="Automatic Ticket Purchases" />
      </div>
      <button
        aria-label="Ticket Autobuyer Settings"
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
          vsp,
          notMixedAccounts,
          isValid,
          clicked,
          VSPSelectControl
        }}
      />
    </div>
  </>
);

export default TicketAutoBuyerForm;
