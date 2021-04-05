import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { Balance, TransitionMotionWrapper } from "shared";
import { SendTransactionButton } from "buttons";
import { UnsignedTx } from "shared";

const wrapperComponent = (props) => <div {...props} />;

const Form = ({
  isSendSelf,
  outputs,
  totalSpent,
  estimatedFee,
  estimatedSignedSize,
  isValid,
  getOutputRows,
  willLeave,
  willEnter,
  nextAddressAccount,
  showPassphraseModal,
  resetShowPassphraseModal,
  unsignedRawTx,
  isWatchingOnly,
  isTrezor,
  insuficientFunds,
  styles,
  hideDetails,
  sendButtonLabel,
  getRunningIndicator,
  account
}) => (
  <>
    <div className={classNames(styles.sendArea, styles.isRow)}>
      <TransitionMotionWrapper
        {...{ styles: getOutputRows(), willLeave, willEnter, wrapperComponent }}
      />
      <div className={styles.detailsArea}>
        {!hideDetails && (
          <div className={styles.isRow}>
            <div className={styles.detailsLabelColumn}>
              <div>
                <T id="send.totalAmountEstimation" m="Total amount sending" />:
              </div>
              <div>
                <T id="send.feeEstimation" m="Estimated Fee" />:
              </div>
              <div>
                <T id="send.sizeEstimation" m="Estimated Size" />:
              </div>
            </div>
            <div className={styles.detailsValueColumn}>
              <Balance
                flat
                amount={totalSpent}
                classNameUnit={styles.detailsUnit}
              />
              <Balance
                flat
                amount={estimatedFee}
                classNameUnit={styles.detailsUnit}
              />
              <div>{`${estimatedSignedSize} Bytes`}</div>
            </div>
          </div>
        )}
        <div className={styles.sendButtonArea}>
          {insuficientFunds && (
            <div className={styles.error}>
              <T id="send.insuficient.funds" m="Insufficient funds" />
            </div>
          )}
          {((isTrezor && isWatchingOnly) || !isWatchingOnly) &&
            (getRunningIndicator ? (
              <Tooltip
                content={
                  <T
                    id="send.indicator.running"
                    m="Privacy Mixer, Autobuyer or Purchase Ticket Attempt running, please shut them off before sending a transaction."
                  />
                }>
                <SendTransactionButton
                  disabled={true}
                  buttonLabel={sendButtonLabel}
                />
              </Tooltip>
            ) : (
              <SendTransactionButton
                disabled={!isValid()}
                showModal={showPassphraseModal}
                onShow={resetShowPassphraseModal}
                buttonLabel={sendButtonLabel}
                account={account}
              >
                <div className={styles.passphraseModal}>
                  {!isSendSelf ? (
                    <>
                      <div className={styles.passphraseModalLabel}>
                        {outputs.length > 1 ? (
                          <T
                            id="send.confirmAmountAddresses"
                            m="Destination addresses"
                          />
                        ) : (
                          <T
                            id="send.confirmAmountAddress"
                            m="Destination address"
                          />
                        )}
                        :
                      </div>
                      {outputs.map((output, index) => (
                        <div
                          className={styles.passphraseModalAddress}
                          key={"confirm-" + index}>
                          {output.data.destination}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className={styles.passphraseModalLabel}>
                        <T
                          id="send.confirmAmountAccount"
                          m="Destination account"
                        />
                        :
                      </div>
                      <div className={styles.passphraseModalAddress}>
                        {nextAddressAccount.name}
                      </div>
                    </>
                  )}
                  <div className={styles.passphraseModalLabel}>
                    <T id="send.confirmAmountLabelFor" m="Total Spent" />:
                  </div>
                  <div className={styles.passphraseModalBalance}>
                    <Balance amount={totalSpent} />
                  </div>
                </div>
              </SendTransactionButton>
            ))}
        </div>
      </div>
    </div>
    {unsignedRawTx && isWatchingOnly && !isTrezor && (
      <UnsignedTx
        title={<T id="send.unsignedRawTxTite" m="Unsigned Raw Transaction:" />}
        tx={unsignedRawTx}
      />
    )}
  </>
);

export default Form;
