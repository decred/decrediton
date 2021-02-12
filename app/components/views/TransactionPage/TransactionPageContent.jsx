import { Balance, CopyToClipboard, ExternalLink } from "shared";
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

const TransactionPageContent = ({
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
            <ExternalLink className={styles.value} href={txUrl}>
              {txHash}
            </ExternalLink>
          </div>
        </div>
        <div className={styles.topRow}>
          <div className={styles.name}>
            {!isPending ? (
              <div className={styles.indicatorConfirmed}>
                <T id="txDetails.indicatorConfirmed" m="Confirmed" />
              </div>
            ) : (
              <div className={styles.indicatorPending}>
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
        <div className={styles.abandonRebroadcastArea}>
          <div className={styles.rebroadcastButtonContainer}>
            <KeyBlueButton
              className={styles.rebroadcastButton}
              onClick={publishUnminedTransactions}>
              <T
                id="txDetails.rebroadcastTransactions"
                m="Rebroadcast Transaction"
              />
            </KeyBlueButton>
          </div>
          <div className={styles.abandonButtonContainer}>
            <KeyBlueButton
              className={styles.abandonButton}
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
            <div className={styles.inputArea}>
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
                  <div className={styles.address}>{accountName}</div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.inputArea}>
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
                  <div className={styles.address}>
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
            <div className={styles.outputArea}>
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
                  <div className={styles.address}>
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
            <div className={styles.outputArea}>
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
                  <div className={classNames(styles.address, styles.nonWallet)}>
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
                <ExternalLink className={styles.value} href={txBlockUrl}>
                  {txBlockHash}
                </ExternalLink>
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
        <div className={classNames(styles.topRow, styles.rowTransaction)}>
          <div className={styles.name}>
            <T id="txDetails.rawTransactionLabel" m="Raw Transaction" />
          </div>
          <div className={styles.value}>
            <div className={styles.valueRawTx}>{rawTx}</div>
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

export default TransactionPageContent;
