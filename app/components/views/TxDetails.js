import { Balance, CopyToClipboard } from "shared";
import { StandaloneHeader, StandalonePage } from "layout";
import { shell } from "electron";
import { transactionDetails } from "connectors";
import { SlateGrayButton } from "buttons";
import { addSpacingAroundText, tsToDate, reverseHash } from "helpers";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { DecodedTransaction }  from "middleware/walletrpc/api_pb";
import "style/TxDetails.less";
import "style/Fonts.less";

const messages = defineMessages({
  Ticket:     { id: "transaction.type.ticket", defaultMessage: "Ticket" },
  Vote:       { id: "transaction.type.vote",   defaultMessage: "Vote" },
  Revocation: { id: "transaction.type.revoke", defaultMessage: "Revoke" }
});

const headerIcons = {
  in:         "plusBig",
  out:        "minusBig",
  transfer:   "walletGray",
  Ticket:     "ticketSmall",
  Vote:       "ticketSmall",
  Revocation: "ticketSmall",
};

function mapNonWalletOutput(output) {
  const address = output.getAddressesList()[0] || "[script]";

  const amount = output.getScriptClass() === DecodedTransaction.Output.ScriptClass.NULL_DATA
    ? "[null data]"
    : <Balance amount={output.getValue()} />;

  return { address, amount };
}

function mapNonWalletInput(input) {
  const address =
    reverseHash(Buffer.from(input.getPreviousTransactionHash()).toString("hex")) +
    ":" +
    input.getPreviousTransactionIndex();

  const amount = input.getAmountIn();

  return { address, amount };
}

const TxDetails = ({
  decodedTransaction,
  tx: {
    txHash,
    txUrl,
    txHeight,
    txType,
    txInputs,
    txOutputs,
    txBlockHash,
    txBlockUrl,
    txAmount,
    txFee,
    txDirection,
    txTimestamp,
    rawTx
  },
  currentBlockHeight,
  intl,
  goBackHistory
}) => {
  const isConfirmed = !!txTimestamp;
  const icon = headerIcons[txType || txDirection];
  const subtitle = isConfirmed ? <T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsToDate(txTimestamp) }}/> : <T id="txDetails.unConfirmed" m="Unconfirmed"/>;
  const goBack = () => goBackHistory();
  const openTxUrl = () => shell.openExternal(txUrl);
  const openBlockUrl = () => shell.openExternal(txBlockUrl);
  const title = txType ? intl.formatMessage(messages[txType]) :
    <Balance title bold amount={txDirection !== "in" ? -txAmount : txAmount}/>;

  let nonWalletInputs = [];
  let nonWalletOutputs = [];
  if (decodedTransaction) {
    const walletOutputIndices = txOutputs.map(v => v.index);
    const walletInputIndices = txInputs.map(v => v.index);

    nonWalletInputs = decodedTransaction.transaction.getInputsList()
      .filter((v, i) => walletInputIndices.indexOf(i) === -1)
      .map(mapNonWalletInput);
    nonWalletOutputs = decodedTransaction.transaction.getOutputsList()
      .filter((v, i) => walletOutputIndices.indexOf(i) === -1)
      .map(mapNonWalletOutput);
  }
  const hasNonWalletIO = nonWalletInputs.length || nonWalletOutputs.length;

  const backBtn =
    <SlateGrayButton onClick={ goBack }>
      <T id="txDetails.backBtn" m="Back" />
    </SlateGrayButton>;

  const header =
    <StandaloneHeader
      title={title}
      iconClassName={icon}
      description={subtitle}
      actionButton={backBtn}
    />;

  return (
    <StandalonePage header={header}>
      <div className="txdetails-top">
        <div className="txdetails-name">
          <T id="txDetails.transactionLabel" m="Transaction" />:
        </div>
        <div className="txdetails-value">
          <a onClick={ openTxUrl } style={{ cursor: "pointer" }}>{txHash}</a>
        </div>
        <div className="txdetails-name">
          {isConfirmed ? (<div className="txdetails-indicator-confirmed">
            <T id="transaction.indicatorConfirmed" m="Confirmed" />
          </div>) : (<div className="txdetails-indicator-pending">
            <T id="transaction.indicatorPending" m="Pending" /></div>)}
        </div>
        <div className="txdetails-value">
          <span className="txdetails-value-text">
            <T id="transaction.confirmationHeight"
              m="{confirmations, plural, =0 {pending} one {# confirmation} other {# confirmations}}"
              values={{ confirmations: (isConfirmed ? currentBlockHeight - txHeight : 0) }} />
          </span>
        </div>
        <div className="txdetails-overview">
          <div className="txdetails-input-area">
            <div className="txdetails-overview-title-consumed">
              <T id="txDetails.walletInputs" m="Wallet Inputs" />
            </div>
            <div className="txdetails-input-arrow"></div>
            {txInputs.map(({ accountName, amount }, idx) => (
              <div key={idx} className="txdetails-row">
                <div className="txdetails-address">{accountName}</div>
                <div className="txdetails-amount"><Balance amount={amount} /></div>
              </div>
            ))}
          </div>
          <div className="txdetails-output-area">
            <div className="txdetails-overview-title-created">
              <T id="txDetails.walletOutputs" m="Wallet Outputs" />
            </div>
            {txOutputs.map(({ accountName, address, amount }, idx) => (
              <div key={idx} className="txdetails-row">
                <div className="txdetails-address">{txDirection === "out" ? "change" : accountName ? addSpacingAroundText(accountName) : addSpacingAroundText(address)}</div>
                <div className="txdetails-amount"><Balance amount={amount} /></div>
              </div>
            ))}
          </div>
        </div>

        {hasNonWalletIO
          ? <Aux>
            <div className="txdetails-overview">
              <div className="txdetails-input-area">
                <div className="txdetails-overview-title-consumed">
                  <T id="txDetails.nonWalletInputs" m="Non Wallet Inputs" />
                </div>
                {nonWalletInputs.map(({ address, amount }, idx) => (
                  <div key={idx} className="txdetails-row">
                    <div className="txdetails-address">{addSpacingAroundText(address)}</div>
                    <div className="txdetails-amount"><Balance amount={amount} /></div>
                  </div>
                ))}
              </div>
              <div className="txdetails-output-area">
                <div className="txdetails-overview-title-created">
                  <T id="txDetails.nonWalletOutputs" m="Non Wallet Outputs" />
                </div>
                {nonWalletOutputs.map(({ address, amount }, idx) => (
                  <div key={idx} className="txdetails-row">
                    <div className="txdetails-address">{addSpacingAroundText(address)}</div>
                    <div className="txdetails-amount">{amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </Aux> : null}

        {txDirection !== "in" && txType !== "Vote" &&
        <Aux>
          <div className="txdetails-name"><T id="txDetails.transactionFeeLabel" m="Transaction fee" />:</div>
          <div className="txdetails-value"><Balance amount={txFee} /></div>
        </Aux> }
      </div>
      <div className="txdetails-details">
        <div className="txdetails-title"><T id="txDetails.properties" m="Properties" /></div>
        {isConfirmed &&
          <Aux>
            <div className="txdetails-name"><T id="txDetails.blockLabel" m="Block" />:</div>
            <div className="txdetails-value">
              <a onClick={ openBlockUrl } style={{ cursor: "pointer" }}>{txBlockHash}</a>
            </div>
            <div className="txdetails-name"><T id="txDetails.blockHeightLabel" m="Height" /> :</div>
            <div className="txdetails-value">{txHeight}</div>
          </Aux>
        }
        <div className="txdetails-name"><T id="txDetails.rawTransactionLabel" m="Raw Transaction" />:</div>
        <div className="txdetails-value"><div className="txdetails-value-rawtx">{rawTx}</div><CopyToClipboard textToCopy={rawTx} className="receive-content-nest-copy-to-clipboard-icon" /></div>
      </div>
    </StandalonePage>
  );
};

export default transactionDetails(injectIntl(TxDetails));
