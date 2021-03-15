import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { DcrInput, AccountsSelect, LEGACY_StakePoolSelect } from "inputs";
import { Tooltip, classNames } from "pi-ui";
import { Balance, Subtitle } from "shared";
import styles from "./TicketAutoBuyer.module.css";

const TicketAutoBuyerForm = ({
  onStartAutoBuyer,
  onDisableTicketAutoBuyer,
  isTicketAutoBuyerEnabled,
  balanceToMaintain,
  setBalanceToMaintain,
  balanceToMaintainError,
  account,
  setAccount,
  configuredStakePools,
  stakePool,
  setStakePool,
  isFormValid,
  clicked,
  onClick,
  notMixedAccounts,
  getRunningIndicator
}) => (
  <>
    <Subtitle
      title={
        <T id="automatictickets.subtitle" m="Automatic Ticket Purchases" />
      }
    />
    <div className={styles.wrapper}>
      <div className={styles.row}>
        {isTicketAutoBuyerEnabled ? (
          <AutoBuyerSwitch enabled onClick={onDisableTicketAutoBuyer} />
        ) : getRunningIndicator ? (
          <Tooltip
            content={
              <T
                id="tickets.autobuyer-legacy.running"
                m="Privacy Mixer or Purchase Ticket Attempt running, please shut them off before purchasing tickets."
              />
            }>
            <AutoBuyerPassphraseModalSwitch disabled={true} />
          </Tooltip>
        ) : (
          <AutoBuyerPassphraseModalSwitch
            modalTitle={
              <T
                id="tickets.startAutoBuyerConfirmation"
                m="Start Ticket Buyer Confirmation"
              />
            }
            modalDescription={
              <div>
                <span className={styles.orangeWarning}>
                  <T
                    id="tickets.startAutoBuyerConfirmation.attention"
                    m="Attention!"
                  />
                </span>
                <T
                  id="tickets.startAutoBuyerConfirmation.description"
                  m="Decrediton must remain running for tickets to be automatically purchased."
                />
                <div>
                  <div className={styles.isRow}>
                    <div className={styles.confirmLabel}>
                      <T
                        id="autobuyer.modal.balanceToMaintain"
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
                      <T id="autobuyer.modal.stakepool" m="VSP" />:
                    </div>
                    <div>{stakePool && stakePool.Host}</div>
                  </div>
                </div>
              </div>
            }
            onSubmit={onStartAutoBuyer}
            isValid={isFormValid}
            onClick={onClick}
          />
        )}
        <div className={styles.rowPortionHalf}>
          <label>
            <T id="autobuyer.accountFrom" m="From" />:
          </label>
          <div className={styles.input}>
            <AccountsSelect
              {...{ account }}
              disabled={isTicketAutoBuyerEnabled}
              onChange={setAccount}
              showAccountsButton={false}
              hideSpendable={true}
              filterAccounts={notMixedAccounts}
            />
          </div>
        </div>
        <div className={classNames(styles.rowPortionHalf, styles.isRow)}>
          <label>
            <T id="autobuyer.stakePoolLabel" m="VSP" />:
          </label>
          <div className={styles.input}>
            <LEGACY_StakePoolSelect
              options={configuredStakePools}
              disabled={isTicketAutoBuyerEnabled}
              value={stakePool}
              onChange={setStakePool}
            />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.rowPortionFull}>
          <label htmlFor="balanceToMaintain">
            <T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />:
          </label>
          <div className={styles.input}>
            <DcrInput
              id="balanceToMaintain"
              disabled={isTicketAutoBuyerEnabled}
              amount={balanceToMaintain}
              onChangeAmount={({ atomValue }) =>
                setBalanceToMaintain(atomValue)
              }
              invalid={balanceToMaintainError}
              invalidMessage={
                <T
                  id="autobuyer.balanceToMaintainError"
                  m="Your balance to mantain is invalid"
                />
              }
              showErrors
            />
          </div>
        </div>
      </div>
      {clicked && isFormValid === false && (
        <div className={styles.error}>
          <T id="autobuyer.startErr" m="Fill all fields." />
        </div>
      )}
    </div>
  </>
);

export default TicketAutoBuyerForm;
