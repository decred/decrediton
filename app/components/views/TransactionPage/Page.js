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
      <div className={styles.top}>
        <div className={styles.topRow}>
          <div className={styles.name}>
            <T id="txDetails.transactionLabel" m="Transaction" />:
          </div>
          <div className={styles.value}>
            <a onClick={openTxUrl} style={{ cursor: "pointer" }}>
              {txHash}
            </a>
          </div>
        </div>
        <div className={styles.topRow}>
          <div className={styles.name}>
            {!isPending ? (
              <div
                className={classNames(
                  styles.indicatorConfirmed,
                  styles.indicatorMixin
                )}>
                <T id="txDetails.indicatorConfirmed" m="Confirmed" />
              </div>
            ) : (
              <div
                className={classNames(
                  styles.indicatorPending,
                  styles.indicatorMixin
                )}>
                <T id="txDetails.indicatorPending" m="Pending" />
              </div>
            )}
          </div>
          <div className={styles.value}>
            {!isPending && (
              <span className={styles.valueText}>
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
          <div className={styles.topRow}>
            <div className={styles.name}>
              <T id="txDetails.toAddress" m="To address" />:
            </div>
            <div className={classNames(styles.value, styles.nonFlex)}>
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
          <div className={styles.topRow}>
            <div className={styles.name}>
              <T id="txDetails.transactionFeeLabel" m="Transaction fee" />:
            </div>
            <div className={styles.value}>
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
      <div className={styles.io}>
        <div className={styles.title}>
          <T id="txDetails.io.title" m="I/O Details" />
        </div>
        <div className={styles.overview}>
          <div className={styles.inputs}>
            <div className={styles.areaMixin}>
              <div
                className={
                  txInputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.walletInputs" m="Wallet Inputs" />
              </div>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div
                    className={classNames(
                      styles.address,
                      styles.blueValueHighlightMixin
                    )}>
                    {accountName}
                  </div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.areaMixin}>
              <div
                className={
                  nonWalletInputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.nonWalletInputs" m="Non Wallet Inputs" />
              </div>
              {nonWalletInputs.map(({ address, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div
                    className={classNames(
                      styles.address,
                      styles.blueValueHighlightMixin
                    )}>
                    {addSpacingAroundText(address)}
                  </div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.inputArrow}></div>
          <div className={styles.outputs}>
            <div
              className={classNames(
                styles.outputArea,
                styles.areaMixin
              )}>
              <div
                className={
                  txOutputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.walletOutputs" m="Wallet Outputs" />
              </div>
              {txOutputs.map(({ accountName, decodedScript, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div
                    className={classNames(
                      styles.address,
                      styles.blueValueHighlightMixin
                    )}>
                    {txDirection === TRANSACTION_DIR_SENT
                      ? "change"
                      : accountName
                      ? addSpacingAroundText(accountName)
                      : addSpacingAroundText(decodedScript.address)}
                  </div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div
              className={classNames(
                styles.outputArea,
                styles.areaMixin
              )}>
              <div
                className={
                  nonWalletOutputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.nonWalletOutputs" m="Non Wallet Outputs" />
              </div>
              {nonWalletOutputs.map(({ address, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div
                    className={classNames(
                      styles.address,
                      styles.nonWallet,
                      styles.blueValueHighlightMixin
                    )}>
                    {addSpacingAroundText(address)}
                  </div>
                  <div className={styles.amount}>{amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.title}>
          <T id="txDetails.properties" m="Properties" />
        </div>
        {!isPending && (
          <>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.blockLabel" m="Block" />
              </div>
              <div className={styles.value}>
                <a onClick={openBlockUrl} style={{ cursor: "pointer" }}>
                  {txBlockHash}
                </a>
              </div>
            </div>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.blockHeightLabel" m="Height" />
              </div>
              <div className={styles.value}>{txHeight}</div>
            </div>
          </>
        )}
        <div
          className={classNames(styles.topRow, styles.rowTransaction)}>
          <div className={styles.name}>
            <T id="txDetails.rawTransactionLabel" m="Raw Transaction" />
          </div>
          <div className={styles.value}>
            <div className={styles.valueRawtx}>{rawTx}</div>
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
