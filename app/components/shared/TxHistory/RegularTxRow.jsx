import Row from "./Row";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
} from "constants";

const RegularTxRow = ({
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
        <Balance
          amount={
            txDirection !== TRANSACTION_DIR_RECEIVED ? -txAmount : txAmount
          }
        />
      </span>
      {!overview &&
        (txDirection === TRANSACTION_DIR_TRANSFERRED ? (
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
        ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
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
        {txDirection === TRANSACTION_DIR_TRANSFERRED ? (
          <T
            id="txHistory.transfer.tx"
            m="From {debAcc} To {credAcc}"
            values={{
              debAcc: txAccountNameDebited,
              credAcc: txAccountNameCredited
            }}
          />
        ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
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

export default RegularTxRow;
