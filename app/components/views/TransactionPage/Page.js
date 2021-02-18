import { Balance, CopyToClipboard } from "shared";
import { shell } from "electron";
import { KeyBlueButton } from "buttons";
import { addSpacingAroundText } from "helpers";
import { FormattedMessage as T } from "react-intl";
import { DecodedTransaction } from "middleware/walletrpc/api_pb";
import {
  VOTE,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_SENT
} from "constants/Decrediton";
import styles from "./TransactionPage.module.css";
import { classNames } from "pi-ui";

function mapNonWalletOutput(output) {
  const address =
    output.decodedScript.address || `[script] - ${output.decodedScript.asm}`;

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
  abandonTransaction,
  publishUnminedTransactions,
  currentBlockHeight
}) => {
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
      <div className={styles.txdetailsTop}>
        <div className={styles.txdetailsTopRow}>
          <div className={styles.txdetailsName}>
            <T id="txDetails.transactionLabel" m="Transaction" />:
          </div>
          <div className={styles.txdetailsValue}>
            <a onClick={openTxUrl} style={{ cursor: "pointer" }}>
              {txHash}
            </a>
          </div>
        </div>
        <div className={styles.txdetailsTopRow}>
          <div className={styles.txdetailsName}>
            {!isPending ? (
              <div
                className={classNames(
                  styles.txdetailsIndicatorConfirmed,
                  styles.txdetailsIndicatorMixin
                )}>
                <T id="txDetails.indicatorConfirmed" m="Confirmed" />
              </div>
            ) : (
              <div
                className={classNames(
                  styles.txdetailsIndicatorPending,
                  styles.txdetailsIndicatorMixin
                )}>
                <T id="txDetails.indicatorPending" m="Pending" />
              </div>
            )}
          </div>
          <div className={styles.txdetailsValue}>
            {!isPending && (
              <span className={styles.txdetailsValueText}>
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
          <div className={styles.txdetailsTopRow}>
            <div className={styles.txdetailsName}>
              <T id="txDetails.toAddress" m="To address" />:
            </div>
            <div className={classNames(styles.txdetailsValue, styles.nonFlex)}>
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
          <div className={styles.txdetailsTopRow}>
            <div className={styles.txdetailsName}>
              <T id="txDetails.transactionFeeLabel" m="Transaction fee" />:
            </div>
            <div className={styles.txdetailsValue}>
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
              onClick={() => abandonTransaction(txHash)}>
              <T id="txDetails.abandontTransaction" m="Abandon Transaction" />
            </KeyBlueButton>
          </div>
        </div>
      )}
      <div className={styles.txdetailsIo}>
        <div className={styles.txdetailsTitle}>
          <T id="txDetails.io.title" m="I/O Details" />
        </div>
        <div className={styles.txdetailsOverview}>
          <div className={styles.txdetailsInputs}>
            <div className={styles.txDetailsAreaMixin}>
              <div
                className={
                  txInputs.length > 0
                    ? styles.txdetailsOverviewTitleConsumed
                    : styles.txdetailsOverviewTitleEmpty
                }>
                <T id="txDetails.walletInputs" m="Wallet Inputs" />
              </div>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} className={styles.txdetailsRow}>
                  <div
                    className={classNames(
                      styles.txdetailsAddress,
                      styles.blueValueHighlightMixin
                    )}>
                    {accountName}
                  </div>
                  <div className={styles.txdetailsAmount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.txDetailsAreaMixin}>
              <div
                className={
                  nonWalletInputs.length > 0
                    ? styles.txdetailsOverviewTitleConsumed
                    : styles.txdetailsOverviewTitleEmpty
                }>
                <T id="txDetails.nonWalletInputs" m="Non Wallet Inputs" />
              </div>
              {nonWalletInputs.map(({ address, amount }, idx) => (
                <div key={idx} className={styles.txdetailsRow}>
                  <div
                    className={classNames(
                      styles.txdetailsAddress,
                      styles.blueValueHighlightMixin
                    )}>
                    {addSpacingAroundText(address)}
                  </div>
                  <div className={styles.txdetailsAmount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.txdetailsInputArrow}></div>
          <div className={styles.txdetailsOutputs}>
            <div
              className={classNames(
                styles.txdetailsOutputArea,
                styles.txDetailsAreaMixin
              )}>
              <div
                className={
                  txOutputs.length > 0
                    ? styles.txdetailsOverviewTitleConsumed
                    : styles.txdetailsOverviewTitleEmpty
                }>
                <T id="txDetails.walletOutputs" m="Wallet Outputs" />
              </div>
              {txOutputs.map(({ accountName, decodedScript, amount }, idx) => (
                <div key={idx} className={styles.txdetailsRow}>
                  <div
                    className={classNames(
                      styles.txdetailsAddress,
                      styles.blueValueHighlightMixin
                    )}>
                    {txDirection === TRANSACTION_DIR_SENT
                      ? "change"
                      : accountName
                      ? addSpacingAroundText(accountName)
                      : addSpacingAroundText(decodedScript.address)}
                  </div>
                  <div className={styles.txdetailsAmount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div
              className={classNames(
                styles.txdetailsOutputArea,
                styles.txDetailsAreaMixin
              )}>
              <div
                className={
                  nonWalletOutputs.length > 0
                    ? styles.txdetailsOverviewTitleConsumed
                    : styles.txdetailsOverviewTitleEmpty
                }>
                <T id="txDetails.nonWalletOutputs" m="Non Wallet Outputs" />
              </div>
              {nonWalletOutputs.map(({ address, amount }, idx) => (
                <div key={idx} className={styles.txdetailsRow}>
                  <div
                    className={classNames(
                      styles.txdetailsAddress,
                      styles.nonWallet,
                      styles.blueValueHighlightMixin
                    )}>
                    {addSpacingAroundText(address)}
                  </div>
                  <div className={styles.txdetailsAmount}>{amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.txdetailsDetails}>
        <div className={styles.txdetailsTitle}>
          <T id="txDetails.properties" m="Properties" />
        </div>
        {!isPending && (
          <>
            <div className={styles.txdetailsTopRow}>
              <div className={styles.txdetailsName}>
                <T id="txDetails.blockLabel" m="Block" />
              </div>
              <div className={styles.txdetailsValue}>
                <a onClick={openBlockUrl} style={{ cursor: "pointer" }}>
                  {txBlockHash}
                </a>
              </div>
            </div>
            <div className={styles.txdetailsTopRow}>
              <div className={styles.txdetailsName}>
                <T id="txDetails.blockHeightLabel" m="Height" />
              </div>
              <div className={styles.txdetailsValue}>{txHeight}</div>
            </div>
          </>
        )}
        <div
          className={classNames(styles.txdetailsTopRow, styles.rowTransaction)}>
          <div className={styles.txdetailsName}>
            <T id="txDetails.rawTransactionLabel" m="Raw Transaction" />
          </div>
          <div className={styles.txdetailsValue}>
            <div className={styles.txdetailsValueRawtx}>{rawTx}</div>
            <CopyToClipboard
              textToCopy={rawTx}
              className={styles.receiveContentNestCopyToClipboardIcon}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
