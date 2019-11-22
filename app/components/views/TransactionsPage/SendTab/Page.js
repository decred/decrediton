import { FormattedMessage as T } from "react-intl";
import { Balance, TransitionMotionWrapper, Subtitle } from "shared";
import { SendTransactionButton } from "buttons";
import { CopyToClipboard } from "shared";
import "style/SendPage.less";
import "style/MiscComponents.less";

const wrapperComponent = props => <div className="output-row" { ...props } />;

const SendPage = ({
  isSendSelf,
  outputs,
  totalSpent,
  estimatedFee,
  estimatedSignedSize,
  isValid,
  getStyles,
  willLeave,
  willEnter,
  nextAddressAccount,
  showPassphraseModal,
  resetShowPassphraseModal,
  unsignedRawTx,
  isWatchingOnly,
  isTrezor,
  insuficientFunds
}) => (
  <>
    <Subtitle title={<T id="send.subtitle" m="Send DCR"/>} />
    <div className="send-wrapper-area is-row">
      <TransitionMotionWrapper {...{ styles: getStyles(), willLeave, willEnter, wrapperComponent }} />
      <div className="details-area">
        <div className="details-title">Details</div>
        <div className="is-row">
          <div className="details-label-column">
            <div className="total-amount-sending-text">
              <T id="send.totalAmountEstimation" m="Total amount sending" />:
            </div>
            <div className="estimated-fee-send-text">
              <T id="send.feeEstimation" m="Estimated Fee" />:
            </div>
            <div className="estimated-size-send-text">
              <T id="send.sizeEstimation" m="Estimated Size" />:
            </div>
          </div>
          <div className = "details-value-column">
            <Balance flat amount={totalSpent} />
            <Balance flat amount={estimatedFee} />
            <div>{estimatedSignedSize}<span className="total-amount-send-amount-bytes"> Bytes</span></div>
          </div>
        </div>
      </div>
    </div>
    <div className = "send-button-area">
      {
        insuficientFunds &&
          <div className="error"><T id="send.insuficient.funds" m="Insuficient funds" /></div>
      }
      { ( (isTrezor && isWatchingOnly) || !isWatchingOnly ) &&
        <SendTransactionButton
          disabled={!isValid}
          showModal={showPassphraseModal}
          onShow={resetShowPassphraseModal} >
          <div className="passphrase-modal-confirm-send">
            { !isSendSelf ?
              <>
                <div className="passphrase-modal-confirm-send-label">{outputs.length > 1 ? <T id="send.confirmAmountAddresses" m="Destination addresses" /> : <T id="send.confirmAmountAddress" m="Destination address" /> }:</div>
                {outputs.map((output, index) => {
                  return (
                    <div className="passphrase-modal-confirm-send-address" key={"confirm-" + index}>{output.data.destination}</div>
                  );}
                )}
              </> :
              <>
                <div className="passphrase-modal-confirm-send-label"><T id="send.confirmAmountAccount" m="Destination account" />:</div>
                <div className="passphrase-modal-confirm-send-address">{nextAddressAccount.name}</div>
              </>
            }
            <div className="passphrase-modal-confirm-send-label"><T id="send.confirmAmountLabelFor" m="Total Spent" />:</div>
            <div className="passphrase-modal-confirm-send-balance"><Balance amount={totalSpent} /></div>
          </div>
        </SendTransactionButton>
      }
    </div>
    { unsignedRawTx && isWatchingOnly && !isTrezor && (
      <div className="unsigned-raw-tx-area">
        <div className="unsigned-raw-tx-title"><T id="send.unsignedRawTxTite" m="Unsigned Raw Transaction:" /></div>
        <div className="unsigned-raw-tx">
          {unsignedRawTx}
        </div>
        <CopyToClipboard textToCopy={unsignedRawTx} className="unsigned-raw-tx-copy-to-clipboard-icon" />
      </div>
    )}
  </>
);

export default SendPage;
