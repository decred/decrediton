import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { DcrInput, AccountsSelect, VSPSelect } from "inputs";
import { Balance, Subtitle } from "shared";
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
  clicked,
  notMixedAccounts,
  getRunningIndicator
}) => (
  <>
    <Subtitle
      title={<T id="vsp.autobuyer.subtitle" m="Automatic Ticket Purchases" />}
    />
    <div className={styles.autobuyerWrapper}>
      <div className="stakepool-auto-buyer-row">
        {isRunning ? (
          <AutoBuyerSwitch enabled onClick={onStopAutoBuyer} />
        ) : getRunningIndicator ? (
          <Tooltip
            content={
              <T
                id="tickets.autobuyer.running"
                m="Privacy Mixer or Purchase Ticket Attempt running, please shut them off before starting autobuyer."
              />
            }>
            <AutoBuyerPassphraseModalSwitch isValid={false} />
          </Tooltip>
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
                      {vsp && vsp.host}
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
              filterAccounts={notMixedAccounts}
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
              isDisabled={isRunning}
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
      {clicked && isValid === false && (
        <div className="error">
          <T id="vsp.autobuyer.startErr" m="Fill all fields." />
        </div>
      )}
    </div>
  </>
);

export default TicketAutoBuyerForm;
