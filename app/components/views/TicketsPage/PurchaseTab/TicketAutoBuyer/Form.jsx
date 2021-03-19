import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
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
      <div className={styles.autoBuyerRow}>
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
                      <Balance flat amount={balanceToMaintain} />
                    </div>
                  </div>
                  <div className={styles.isRow}>
                    <div className={styles.confirmLabel}>
                      <T id="vsp.autobuyer.modal.stakepool" m="VSP" />:
                    </div>
                    <div>
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
        <div className={styles.autoBuyerRowPortionHalf}>
          <div className={styles.autobuyerLabel}>
            <T id="vsp.autobuyer.accountFrom" m="From" />:
          </div>
          <div className={styles.autobuyerInput}>
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
        <div className={classNames(styles.autoBuyerRowPortionHalf, styles.isRow)}>
          <div className={styles.autobuyerLabel}>
            <T id="vsp.autobuyer.stakePoolLabel" m="VSP" />:
          </div>
          <div className={styles.autobuyerInput}>
            <VSPSelect
              options={availableVSPs}
              isDisabled={isRunning}
              value={vsp}
              onChange={changeVSP}
            />
          </div>
        </div>
      </div>
      <div className={styles.autoBuyerRow}>
        <div className={styles.autoBuyerRowPortionFull}>
          <label className={styles.autobuyerLabel}>
            <T id="vsp.autobuyer.balanceToMaintain" m="Balance to Maintain" />:
          </label>
          <div className={styles.autobuyerInput}>
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
        <div className={styles.error}>
          <T id="vsp.autobuyer.startErr" m="Fill all fields." />
        </div>
      )}
    </div>
  </>
);

export default TicketAutoBuyerForm;
