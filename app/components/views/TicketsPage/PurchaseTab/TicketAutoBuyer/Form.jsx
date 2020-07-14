import { AutoBuyerSwitch, PassphraseModalSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { DcrInput, AccountsSelect, VSPSelect } from "inputs";
import { Balance, Subtitle } from "shared";

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
  availableVSPs
}) => (
  <>
    <Subtitle
      title={
        <T id="automatictickets.subtitle" m="Automatic Ticket Purchases" />
      }
    />
    <div className="stakepool-flex-height-auto-buyer-wrapper">
      <div className="stakepool-auto-buyer-row">
        {isRunning ? (
          <AutoBuyerSwitch enabled onClick={onStopAutoBuyer} />
        ) : (
          <PassphraseModalSwitch
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
                      {vsp && vsp.Host}
                    </div>
                  </div>
                </div>
              </div>
            }
            onSubmit={onStartAutoBuyer}
          />
        )}
        <div className="stakepool-auto-buyer-row-portion-half">
          <div className="stakepool-autobuyer-label">
            <T id="autobuyer.accountFrom" m="From" />:
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
            <T id="autobuyer.stakePoolLabel" m="VSP" />:
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
            <T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />:
          </div>
          <div className="stakepool-autobuyer-input">
            <DcrInput
              disabled={isRunning}
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
    </div>
  </>
);

export default TicketAutoBuyerForm;
