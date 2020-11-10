import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { DcrInput, AccountsSelect, VSPSelect } from "inputs";
import { Balance } from "shared";
import styles from "../PurchaseTab.module.css";

const TicketAutoBuyerForm = ({
  onStartAutoBuyer,
  onStopAutoBuyer,
  isRunning,
  balanceToMaintain,
  onChangeBalanceToMaintain,
  balanceToMaintainError,
  account,
  changeAccount,
  vsp,
  changeVSP,
  availableVSPs,
  isValid,
  onClick,
  clicked
}) => (
  <div className={styles.autobuyerWrapper}>
    <div className={styles.title}>
      <T id="vsp.automatictickets.subtitle" m="Automatic Ticket Purchases" />
    </div>
    <div className="stakepool-auto-buyer-row">
      {isRunning ? (
        <AutoBuyerSwitch enabled onClick={onStopAutoBuyer} />
      ) : (
          <AutoBuyerPassphraseModalSwitch
            modalTitle={
              <T
                id="vsp.tickets.startAutoBuyerConfirmation"
                m="Start Ticket Buyer Confirmation"
              />
            }
            modalDescription={
              <div>
                <span className="orange-warning">
                  <T
                    id="vsp.tickets.startAutoBuyerConfirmation.attention"
                    m="Attention!"
                  />
                </span>
                <T
                  id="vsp.tickets.startAutoBuyerConfirmation.description"
                  m="Decrediton must remain running for tickets to be automatically purchased."
                />
                <div className="auto-buyer-modal-confirm">
                  <div className="auto-buyer-modal-confirm-row">
                    <div className="auto-buyer-modal-confirm-label">
                      <T
                        id="vsp.autobuyer.modal.balanceToMaintain"
                        m="Balance To Maintain"
                      />
                    :
                  </div>
                    <div className="auto-buyer-modal-confirm-value">
                      <Balance flat amount={balanceToMaintain} />
                    </div>
                  </div>
                  <div className="auto-buyer-modal-confirm-row">
                    <div className="auto-buyer-modal-confirm-label">
                      <T id="vsp.autobuyer.modal.stakepool" m="VSP" />:
                  </div>
                    <div className="auto-buyer-modal-confirm-value">
                      {vsp && vsp.Host}
                    </div>
                  </div>
                </div>
              </div>
            }
            onSubmit={onStartAutoBuyer}
            onClick={onClick}
            isValid={isValid}
          />
        )}
      <div className="stakepool-auto-buyer-row-portion-half">
        <div className="stakepool-autobuyer-label">
          <T id="vsp.autobuyer.accountFrom" m="From" />:
        </div>
        <div className="stakepool-autobuyer-input">
          <AccountsSelect
            {...{ account }}
            disabled={isRunning}
            onChange={changeAccount}
            showAccountsButton={false}
            hideSpendable={true}
          />
        </div>
      </div>
      <div className="stakepool-auto-buyer-row-portion-half is-row">
        <div className="stakepool-autobuyer-label">
          <T id="vsp.autobuyer.stakePoolLabel" m="VSP" />:
        </div>
        <div className="stakepool-autobuyer-input">
          <VSPSelect
            options={availableVSPs}
            disabled={isRunning}
            value={vsp}
            onChange={changeVSP}
          />
        </div>
      </div>
    </div>
    <div className="stakepool-auto-buyer-row">
      <div className="stakepool-auto-buyer-row-portion-full">
        <div className="stakepool-autobuyer-label">
          <T id="vsp.autobuyer.balanceToMaintain" m="Balance to Maintain" />:
        </div>
        <div className="stakepool-autobuyer-input">
          <DcrInput
            disabled={isRunning}
            amount={balanceToMaintain}
            onChangeAmount={onChangeBalanceToMaintain}
            invalid={balanceToMaintainError}
            invalidMessage={
              <T
                id="vsp.autobuyer.balanceToMaintainError"
                m="Your balance to mantain is invalid"
              />
            }
            showErrors
          />
        </div>
      </div>
    </div>
    {
      (clicked && isValid === false) && (
        <div className="error">
          <T id="vsp.autobuyer.startErr" m="Fill all fields." />
        </div>
      )
    }
  </div>
);

export default TicketAutoBuyerForm;
