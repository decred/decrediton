import Row from "./Row";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";

export const RegularTxRow = ({
  txAmount,
  txDirection,
  overview,
  txAccountName,
  pending,
  txTs,
  txOutputAddresses,
  txAccountNameCredited,
  txAccountNameDebited,
  timeMessage,
  ...props
}) => (
  <Row {...{ ...props, txAccountName, pending, overview }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number">
        <Balance amount={txDirection !== "in" ? -txAmount : txAmount} />
      </span>
      {!overview &&
        (txDirection === "transfer" ? (
          <div className="transaction-info is-row">
            <T
              id="txHistory.transfer.tx"
              m="From {debAcc} To {credAcc}"
              values={{
                debAcc: (
                  <div className="transaction-status">
                    <div className="transaction-account-name">
                      {txAccountNameDebited}
                    </div>
                  </div>
                ),
                credAcc: (
                  <div className="transaction-status">
                    <div className="transaction-account-name">
                      {txAccountNameCredited}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        ) : txDirection !== "in" ? (
          <div className="transaction-info is-row">
            <T
              id="txHistory.out.tx"
              m="From {debAcc} To {credAcc}"
              values={{
                debAcc: (
                  <div className="transaction-status">
                    <div className="transaction-account-name">
                      {txAccountName}
                    </div>
                  </div>
                ),
                credAcc: (
                  <div className="transaction-status">
                    <div className="transaction-account-name">
                      {txOutputAddresses}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        ) : (
          <div className="transaction-info is-row">
            <T
              id="txHistory.in.tx"
              m="To {credAcc}"
              values={{
                credAcc: (
                  <div className="transaction-status">
                    <div className="transaction-account-name">
                      {txAccountName}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        ))}
      {!pending && (
        <div className="transaction-time-date-spacer">{timeMessage(txTs)}</div>
      )}
    </div>
    {overview && (
      <div className="transaction-amount-hash">
        {txDirection === "transfer" ? (
          <T
            id="txHistory.transfer.tx"
            m="From {debAcc} To {credAcc}"
            values={{
              debAcc: txAccountNameDebited,
              credAcc: txAccountNameCredited
            }}
          />
        ) : txDirection !== "in" ? (
          <T
            id="txHistory.out.tx"
            m="From {debAcc} To {credAcc}"
            values={{
              debAcc: txAccountName,
              credAcc: txOutputAddresses
            }}
          />
        ) : (
          <T
            id="txHistory.in.tx"
            m="To {credAcc}"
            values={{ credAcc: txAccountName }}
          />
        )}
      </div>
    )}
  </Row>
);
