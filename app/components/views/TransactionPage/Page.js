import { Balance, CopyToClipboard } from "shared";
import { shell } from "electron";
import { KeyBlueButton } from "buttons";
import { addSpacingAroundText } from "helpers";
import { FormattedMessage as T } from "react-intl";
import { DecodedTransaction } from "middleware/walletrpc/api_pb";
import { useSelector, useDispatch } from "react-redux";
import {
  VOTE,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_SENT
} from "constants/Decrediton";
import * as cla from "actions/ControlActions";
import * as sel from "selectors";
import "style/TxDetails.less";

function mapNonWalletOutput(output) {
  const address = output.decodedScript.address || "[script] - " + output.decodedScript.asm;

  const amount =
    output.decodedScript.scriptClass ===
    DecodedTransaction.Output.ScriptClass.NULL_DATA ? (
      "[null data]"
    ) : (
      <Balance amount={output.value} />
    );

  return { address, amount };
}

function mapNonWalletInput(input) {
  const address = `${input.prevTxId}:${input.outputIndex}`;
  const amount = input.amountIn;

  return { address, amount };
}

const Page = ({
  transactionDetails,
  decodedTransaction,
  abandonTransaction
}) => {
  const dispatch = useDispatch();
  const publishUnminedTransactions = () =>
    dispatch(cla.publishUnminedTransactionsAttempt);
  const currentBlockHeight = useSelector(sel.currentBlockHeight);
  const {
    txHash,
    txUrl,
    txHeight,
    txType,
    txInputs,
    txOutputs,
    txBlockHash,
    txBlockUrl,
    txFee,
    txDirection,
    rawTx,
    isPending
  } = transactionDetails;

  const openTxUrl = () => shell.openExternal(txUrl);
  const openBlockUrl = () => shell.openExternal(txBlockUrl);
  let nonWalletInputs = [];
  let nonWalletOutputs = [];

  if (decodedTransaction) {
    const walletOutputIndices = txOutputs.map((v) => v.index);
    const walletInputIndices = txInputs.map((v) => v.index);

    nonWalletInputs = decodedTransaction.inputs
      .filter((v, i) => walletInputIndices.indexOf(i) === -1)
      .map(mapNonWalletInput);
    nonWalletOutputs = decodedTransaction.outputs
      .filter((v, i) => walletOutputIndices.indexOf(i) === -1)
      .map(mapNonWalletOutput);
  }
  return (
    <>
      <div className="txdetails-top">
        <div className="txdetails-top-row">
          <div className="txdetails-name">
            <T id="txDetails.transactionLabel" m="Transaction" />:
          </div>
          <div className="txdetails-value">
            <a onClick={openTxUrl} style={{ cursor: "pointer" }}>
              {txHash}
            </a>
          </div>
        </div>
        <div className="txdetails-top-row">
          <div className="txdetails-name">
            {!isPending ? (
              <div className="txdetails-indicator-confirmed">
                <T id="txDetails.indicatorConfirmed" m="Confirmed" />
              </div>
            ) : (
              <div className="txdetails-indicator-pending">
                <T id="txDetails.indicatorPending" m="Pending" />
              </div>
            )}
          </div>
          <div className="txdetails-value">
            {!isPending && (
              <span className="txdetails-value-text">
                <T
                  id="transaction.confirmationHeight"
                  m="{confirmations, plural, =0 {Mined, block awaiting approval} one {# confirmation} other {# confirmations}}"
                  values={{
                    confirmations: !isPending
                      ? currentBlockHeight - txHeight
                      : 0
                  }}
                />
              </span>
            )}
          </div>
        </div>
        {txType !== VOTE && (
          <div className="txdetails-top-row">
            <div className="txdetails-name">
              <T id="txDetails.toAddress" m="To address" />:
            </div>
            <div className="txdetails-value non-flex">
              {txOutputs.map(({ address }, i) => (
                <div key={i}>{addSpacingAroundText(address)}</div>
              ))}
              {nonWalletOutputs.map(({ address }, i) => (
                <div key={i}>{addSpacingAroundText(address)}</div>
              ))}
            </div>
          </div>
        )}
        {txDirection !== TRANSACTION_DIR_RECEIVED && txType !== VOTE && (
          <div className="txdetails-top-row">
            <div className="txdetails-name">
              <T id="txDetails.transactionFeeLabel" m="Transaction fee" />:
            </div>
            <div className="txdetails-value">
              <Balance amount={txFee} />
            </div>
          </div>
        )}
      </div>
      {isPending && (
        <div className="txdetails-abandon-rebroadcast-area">
          <div className="rebroadcast-button-container">
            <KeyBlueButton
              className="rebroadcast-button"
              onClick={publishUnminedTransactions}>
              <T
                id="txDetails.rebroadcastTransactions"
                m="Rebroadcast Transaction"
              />
            </KeyBlueButton>
          </div>
          <div className="abandon-button-container">
            <KeyBlueButton
              className="abandon-button"
              onClick={abandonTransaction}>
              <T id="txDetails.abandontTransaction" m="Abandon Transaction" />
            </KeyBlueButton>
          </div>
        </div>
      )}
      <div className="txdetails-io">
        <div className="txdetails-title">
          <T id="txDetails.io.title" m="I/O Details" />
        </div>
        <div className="txdetails-overview">
          <div className="txdetails-inputs">
            <div className="txdetails-input-area">
              <div
                className={
                  txInputs.length > 0
                    ? "txdetails-overview-title-consumed"
                    : "txdetails-overview-title-empty"
                }>
                <T id="txDetails.walletInputs" m="Wallet Inputs" />
              </div>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">{accountName}</div>
                  <div className="txdetails-amount">
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div className="txdetails-input-area">
              <div
                className={
                  nonWalletInputs.length > 0
                    ? "txdetails-overview-title-consumed"
                    : "txdetails-overview-title-empty"
                }>
                <T id="txDetails.nonWalletInputs" m="Non Wallet Inputs" />
              </div>
              {nonWalletInputs.map(({ address, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">
                    {addSpacingAroundText(address)}
                  </div>
                  <div className="txdetails-amount">
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="txdetails-input-arrow"></div>
          <div className="txdetails-outputs">
            <div className="txdetails-output-area">
              <div
                className={
                  txOutputs.length > 0
                    ? "txdetails-overview-title-consumed"
                    : "txdetails-overview-title-empty"
                }>
                <T id="txDetails.walletOutputs" m="Wallet Outputs" />
              </div>
              {txOutputs.map(({ accountName, decodedScript, value }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">
                    {txDirection === TRANSACTION_DIR_SENT
                      ? "change"
                      : accountName
                      ? addSpacingAroundText(accountName)
                      : addSpacingAroundText(decodedScript.address)}
                  </div>
                  <div className="txdetails-amount">
                    <Balance amount={value} />
                  </div>
                </div>
              ))}
            </div>
            <div className="txdetails-output-area">
              <div
                className={
                  nonWalletOutputs.length > 0
                    ? "txdetails-overview-title-consumed"
                    : "txdetails-overview-title-empty"
                }>
                <T id="txDetails.nonWalletOutputs" m="Non Wallet Outputs" />
              </div>
              {nonWalletOutputs.map(({ address, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address non-wallet">
                    {addSpacingAroundText(address)}
                  </div>
                  <div className="txdetails-amount">{amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="txdetails-details">
        <div className="txdetails-title">
          <T id="txDetails.properties" m="Properties" />
        </div>
        {!isPending && (
          <>
            <div className="txdetails-top-row">
              <div className="txdetails-name">
                <T id="txDetails.blockLabel" m="Block" />
              </div>
              <div className="txdetails-value">
                <a onClick={openBlockUrl} style={{ cursor: "pointer" }}>
                  {txBlockHash}
                </a>
              </div>
            </div>
            <div className="txdetails-top-row">
              <div className="txdetails-name">
                <T id="txDetails.blockHeightLabel" m="Height" />
              </div>
              <div className="txdetails-value">{txHeight}</div>
            </div>
          </>
        )}
        <div className="txdetails-top-row row-transaction">
          <div className="txdetails-name">
            <T id="txDetails.rawTransactionLabel" m="Raw Transaction" />
          </div>
          <div className="txdetails-value">
            <div className="txdetails-value-rawtx">{rawTx}</div>
            <CopyToClipboard
              textToCopy={rawTx}
              className="receive-content-nest-copy-to-clipboard-icon"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
