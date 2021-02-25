import { AutoBuyerSwitch, AutoBuyerPassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { DcrInput, AccountsSelect, LEGACY_StakePoolSelect } from "inputs";
import { Tooltip } from "pi-ui";
import { Balance, Subtitle } from "shared";

const TicketAutoBuyerForm = ({
  onStartAutoBuyer,
  onDisableTicketAutoBuyer,
  isTicketAutoBuyerEnabled,
  balanceToMaintain,
  onChangeBalanceToMaintain,
  balanceToMaintainError,
  account,
  changeAccount,
  configuredStakePools,
  stakePool,
  changeStakePool,
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
    <div className="stakepool-flex-height-auto-buyer-wrapper">
      <div className="stakepool-auto-buyer-row">
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
                <span className="orange-warning">
                  <T
                    id="tickets.startAutoBuyerConfirmation.attention"
                    m="Attention!"
                  />
                </span>
                <T
                  id="tickets.startAutoBuyerConfirmation.description"
                  m="Decrediton must remain running for tickets to be automatically purchased."
                />
                <div className="auto-buyer-modal-confirm">
                  <div className="auto-buyer-modal-confirm-row">
                    <div className="auto-buyer-modal-confirm-label">
                      <T
                        id="autobuyer.modal.balanceToMaintain"
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
                      <T id="autobuyer.modal.stakepool" m="VSP" />:
                    </div>
                    <div className="auto-buyer-modal-confirm-value">
                      {stakePool && stakePool.Host}
                    </div>
                  </div>
                </div>
              </div>
            }
            onSubmit={onStartAutoBuyer}
            isValid={isFormValid}
            onClick={onClick}
          />
        )}
        <div className="stakepool-auto-buyer-row-portion-half">
          <div className="stakepool-autobuyer-label">
            <T id="autobuyer.accountFrom" m="From" />:
          </div>
          <div className="stakepool-autobuyer-input">
            <AccountsSelect
              {...{ account }}
              disabled={isTicketAutoBuyerEnabled}
              onChange={changeAccount}
              showAccountsButton={false}
              hideSpendable={true}
              filterAccounts={notMixedAccounts}
            />
          </div>
        </div>
        <div className="stakepool-auto-buyer-row-portion-half is-row">
          <div className="stakepool-autobuyer-label">
            <T id="autobuyer.stakePoolLabel" m="VSP" />:
          </div>
          <div className="stakepool-autobuyer-input">
            <LEGACY_StakePoolSelect
              options={configuredStakePools}
              disabled={isTicketAutoBuyerEnabled}
              value={stakePool}
              onChange={changeStakePool}
            />
          </div>
        </div>
      </div>
      <div className="stakepool-auto-buyer-row">
        <div className="stakepool-auto-buyer-row-portion-full">
          <div className="stakepool-autobuyer-label">
            <T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />:
          </div>
          <div className="stakepool-autobuyer-input">
            <DcrInput
              disabled={isTicketAutoBuyerEnabled}
              amount={balanceToMaintain}
              onChangeAmount={onChangeBalanceToMaintain}
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
        <div className="error">
          <T id="autobuyer.startErr" m="Fill all fields." />
        </div>
      )}
    </div>
  </>
);

export default TicketAutoBuyerForm;
