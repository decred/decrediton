import { AutoBuyerSwitch, PassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { DcrInput, AccountsSelect, StakePoolSelect } from "inputs";
import { Balance } from "shared";

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
  changeStakePool
}) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="automatictickets.subtitle" m="Automatic Ticket Purchases"/></div>
    <div className="stakepool-flex-height-auto-buyer-wrapper">
      <div className="stakepool-auto-buyer-row">
        {isTicketAutoBuyerEnabled ?
          <AutoBuyerSwitch enabled onClick={onDisableTicketAutoBuyer} /> :
          <PassphraseModalSwitch
            modalTitle={<T id="tickets.startAutoBuyerConfirmation" m="Start Ticket Buyer Confirmation" />}
            modalDescription={
              <div>
                <span className="orange-warning"><T id="tickets.startAutoBuyerConfirmation.attention" m="Attention!" /></span>
                <T id="tickets.startAutoBuyerConfirmation.description" m="Decrediton must remain running for tickets to be automatically purchased." />
                <div className="auto-buyer-modal-confirm">
                  <div className="auto-buyer-modal-confirm-row">
                    <div className="auto-buyer-modal-confirm-label"><T id="autobuyer.modal.balanceToMaintain" m="Balance To Maintain" />:</div>
                    <div className="auto-buyer-modal-confirm-value"><Balance flat amount={balanceToMaintain} /></div>
                  </div>
                  <div className="auto-buyer-modal-confirm-row">
                    <div className="auto-buyer-modal-confirm-label"><T id="autobuyer.modal.stakepool" m="Stakepool" />:</div>
                    <div className="auto-buyer-modal-confirm-value">{stakePool.Host}</div>
                  </div>
                </div>
              </div>}
            onSubmit={onStartAutoBuyer}
          />
        }
        <div className="stakepool-auto-buyer-row-portion-half">
          <div className="stakepool-autobuyer-label"><T id="autobuyer.accountFrom" m="From" />:</div>
          <div className="stakepool-autobuyer-input">
            <AccountsSelect
              {...{ account }} disabled={isTicketAutoBuyerEnabled} onChange={changeAccount} showAccountsButton={false} hideSpendable={true}/>
          </div>
        </div>
        <div className="stakepool-auto-buyer-row-portion-half">
          <div className="stakepool-autobuyer-label"><T id="autobuyer.stakePoolLabel" m="Stake Pool" />:</div>
          <div className="stakepool-autobuyer-input">
            <StakePoolSelect
              options={configuredStakePools} disabled={isTicketAutoBuyerEnabled} value={stakePool} onChange={changeStakePool} />
          </div>
        </div>
      </div>
      <div className="stakepool-auto-buyer-row">
        <div className="stakepool-auto-buyer-row-portion-full">
          <div className="stakepool-autobuyer-label"><T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />:</div>
          <div className="stakepool-autobuyer-input">
            <DcrInput
              disabled={isTicketAutoBuyerEnabled}
              amount={balanceToMaintain}
              onChangeAmount={onChangeBalanceToMaintain}
              invalid={balanceToMaintainError}
              invalidMessage={<T id="autobuyer.balanceToMaintainError"
                m="Your balance to mantain is invalid" />}
              showErrors
            />
          </div>
        </div>
      </div>
    </div>
  </Aux>
);

export default TicketAutoBuyerForm;
