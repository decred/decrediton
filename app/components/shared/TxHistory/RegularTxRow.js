import Row from "./Row";
import { Balance } from "shared";
import { timeMessage } from "./index";
import { FormattedMessage as T } from "react-intl";

const RegularTxRow = ({
  txAmount, txDirection, overview, txAccountName, pending, txTs, txOutputAddresses,
  txAccountNameCredited, txAccountNameDebited, ...props
}) => (
  <Row {...{ ...props, txAccountName, pending, overview }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      { !overview && (txDirection === "transfer" ?
        ( <div className="transaction-info is-row">
          <T id="txHistory.transfer.tx"
            m="From {debAcc} To {credAcc}"
            values = {{
              debAcc:
            <div className="transaction-status">
              <span className="transaction-account-name">{txAccountNameDebited}</span>
            </div>,
              credAcc:
            <div className="transaction-status">
              <span className="transaction-account-name">{txAccountNameCredited}</span>
            </div>
            }} />
        </div>
        ) : txDirection !== "in" ? (
          <div className="transaction-info is-row">
            <T id="txHistory.out.tx"
              m="From {debAcc} To {credAcc}"
              values = {{
                debAcc:
                  <div className="transaction-status">
                    <span className="transaction-account-name">{txAccountName}</span>
                  </div>,
                credAcc:
                  <div className="transaction-status">
                    <span className="transaction-account-name">{txOutputAddresses}</span>
                  </div>
              }} />
          </div>
        ) : (
          <div className="transaction-info is-row">
            <T id="txHistory.in.tx"
              m="To {credAcc}"
              values = {{ credAcc:
                    <div className="transaction-status">
                      <span className="transaction-account-name">{txAccountName}</span>
                    </div> }} />
          </div>
        ))}
      { !pending &&
        <div className="transaction-time-date-spacer">
          {timeMessage(txTs, props.intl)}
        </div>
      }
    </div>
    { overview &&
        <div className="transaction-amount-hash">
          { txDirection === "transfer" ?
            <T id="txHistory.transfer.tx"
              m="From {debAcc} To {credAcc}"
              values = {{
                debAcc: txAccountNameDebited,
                credAcc: txAccountNameCredited
              }} /> :
            txDirection !== "in" ?
              <T id="txHistory.out.tx"
                m="From {debAcc} To {credAcc}"
                values = {{
                  debAcc: txAccountName,
                  credAcc: txOutputAddresses
                }} /> : (
                <T id="txHistory.in.tx"
                  m="To {credAcc}"
                  values = {{ credAcc: txAccountName }} />
              )}
        </div>
    }

  </Row>
);
