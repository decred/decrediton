import { Balance, CopyToClipboard } from "shared";
import { StandaloneHeader, StandalonePage } from "layout";
import { shell } from "electron";
import { transactionDetails } from "connectors";
import { SlateGrayButton } from "buttons";
import { addSpacingAroundText, reverseHash } from "helpers";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { DecodedTransaction }  from "middleware/walletrpc/api_pb";
import "style/TxDetails.less";
import "style/Fonts.less";
import KeyBlueButton from "../buttons/KeyBlueButton";

const messages = defineMessages({
  Ticket:     { id: "txDetails.type.ticket", defaultMessage: "Ticket" },
  Vote:       { id: "txDetails.type.vote",   defaultMessage: "Vote" },
  Revocation: { id: "txDetails.type.revoke", defaultMessage: "Revoke" },
  Coinbase:   { id: "txDetails.type.coinbase", defaultMessage: "Coinbase" },
});

const headerIcons = {
  in:         "tx-detail-icon-in",
  out:        "tx-detail-icon-out",
  Coinbase:   "tx-detail-icon-in",
  transfer:   "tx-detail-icon-transfer",
  Ticket:     "tx-detail-icon-ticket",
  Vote:       "tx-detail-icon-vote",
  Revocation: "tx-detail-icon-revocation",
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
  tx,
  currentBlockHeight,
  intl,
  goBackHistory,
  tsDate,
  publishUnminedTransactions,
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
    txAmount,
    txFee,
    txDirection,
    txTimestamp,
    rawTx,
    ticketReward,
    ticketPrice,
    enterTimestamp,
    leaveTimestamp,
  } = tx;

  const isConfirmed = !!txTimestamp;
  const icon = headerIcons[txType || txDirection];
  const goBack = () => goBackHistory();
  const openTxUrl = () => shell.openExternal(txUrl);
  const openBlockUrl = () => shell.openExternal(txBlockUrl);
  var title = txType ? intl.formatMessage(messages[txType]) :
    <Balance title bold amount={txDirection !== "in" ? -txAmount : txAmount}/>;
  if (txType == "Ticket" && ticketReward) {
    title = title + ", Voted";
  }
  var sentFromAccount = "";
  if (txDirection == "out") {
    sentFromAccount = txInputs.length > 0 ? txInputs[0].accountName : "";
  }
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

  const backBtn =
    <SlateGrayButton onClick={ goBack } className="thin-button">
      <T id="txDetails.backBtn" m="Back" />
    </SlateGrayButton>;

  var subtitle = <div/>;

  switch (txType) {
  case "Ticket":
  case "Vote":
    subtitle =
    <div className="tx-details-subtitle">
      {isConfirmed ?
        <div className="tx-details-subtitle-pair">
          <div className="tx-details-subtitle-sentfrom"><T id="txDetails.purchasedOn" m="Purchased On" /></div>
          <div className="tx-details-subtitle-date">
            <T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsDate(txType == "Vote" && enterTimestamp ? enterTimestamp : txTimestamp) }}/>
          </div>
        </div>:
        <div className="tx-details-subtitle-date">
          <T id="txDetails.unConfirmed" m="Unconfirmed"/>
        </div>
      }
      {leaveTimestamp && <div className="tx-details-subtitle-pair"><div className="tx-details-subtitle-sentfrom"><T id="txDetails.votedOn" m="Voted On" /></div><div className="tx-details-subtitle-date"><T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsDate(leaveTimestamp) }}/></div></div>}
      {ticketPrice && <div className="tx-details-subtitle-pair"><div className="tx-details-subtitle-sentfrom"><T id="txDetails.ticketCost" m="Ticket Cost" /></div><div className="tx-details-subtitle-account"><Balance amount={ticketPrice}/></div></div> }
      {ticketReward && <div className="tx-details-subtitle-pair"><div className="tx-details-subtitle-sentfrom"><T id="txDetails.reward" m="Reward" /></div><div className="tx-details-subtitle-account"><Balance amount={ticketReward}/></div></div>}
    </div>;
    break;
  default:
    subtitle =
    <div className="tx-details-subtitle">
      {txDirection == "out" ? <Aux><div className="tx-details-subtitle-sentfrom"><T id="txDetails.sentFrom" m="Sent From" /></div><div className="tx-details-subtitle-account">{sentFromAccount}</div></Aux>: <div/>}
      <div className="tx-details-subtitle-date">{isConfirmed ? <T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsDate(txTimestamp) }}/> : <T id="txDetails.unConfirmed" m="Unconfirmed"/> }</div>
    </div>;
  }

  const header =
    <StandaloneHeader
      title={title}
      iconClassName={icon}
      description={subtitle}
      actionButton={backBtn}
    />;

  return (
    <StandalonePage header={header} className="txdetails-standalone-page">
      <div className="txdetails-top">
        <div className="txdetails-top-row">
          <div className="txdetails-name">
            <T id="txDetails.transactionLabel" m="Transaction" />
          </div>
          <div className="txdetails-value">
            <a onClick={ openTxUrl } style={{ cursor: "pointer" }}>{txHash}</a>
          </div>
        </div>
        <div className="txdetails-top-row">
          <div className="txdetails-name">
            {isConfirmed ? (<div className="txdetails-indicator-confirmed">
              <T id="txDetails.indicatorConfirmed" m="Confirmed" />
            </div>) : (<div className="txdetails-indicator-pending">
              <T id="txDetails.indicatorPending" m="Pending" /></div>)}
          </div>
          <div className="txdetails-value">
            {isConfirmed && <span className="txdetails-value-text">
              <T id="transaction.confirmationHeight"
                m="{confirmations, plural, =0 {Mined, block awaiting approval} one {# confirmation} other {# confirmations}}"
                values={{ confirmations: (isConfirmed ? currentBlockHeight - txHeight : 0) }} />
            </span>
            }
          </div>
        </div>
        {txDirection !== "in" && txType !== "Vote" &&
        <div className="txdetails-top-row">
          <div className="txdetails-name"><T id="txDetails.transactionFeeLabel" m="Transaction fee" /></div>
          <div className="txdetails-value"><Balance amount={txFee} /></div>
        </div> }
      </div>
      {!isConfirmed && <KeyBlueButton className="rebroadcast-button" onClick={publishUnminedTransactions}><T id="txDetails.rebroadcastTransactions" m="Rebroadcast Transaction"/></KeyBlueButton> }
      <div className="txdetails-io">
        <div className="txdetails-title"><T id="txDetails.io.title" m="I/O Details" /></div>
        <div className="txdetails-overview">
          <div className="txdetails-inputs">
            <div className="txdetails-input-area">
              <div className={txInputs.length > 0 ? "txdetails-overview-title-consumed" : "txdetails-overview-title-empty"}>
                <T id="txDetails.walletInputs" m="Wallet Inputs" />
              </div>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">{accountName}</div>
                  <div className="txdetails-amount"><Balance amount={amount} /></div>
                </div>
              ))}
            </div>
            <div className="txdetails-input-area">
              <div className={nonWalletInputs.length > 0 ? "txdetails-overview-title-consumed" : "txdetails-overview-title-empty"}>
                <T id="txDetails.nonWalletInputs" m="Non Wallet Inputs" />
              </div>
              {nonWalletInputs.map(({ address, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">{addSpacingAroundText(address)}</div>
                  <div className="txdetails-amount"><Balance amount={amount} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="txdetails-input-arrow"></div>
          <div className="txdetails-outputs">
            <div className="txdetails-output-area">
              <div className={txOutputs.length > 0 ? "txdetails-overview-title-consumed" : "txdetails-overview-title-empty"}>
                <T id="txDetails.walletOutputs" m="Wallet Outputs" />
              </div>
              {txOutputs.map(({ accountName, address, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">{txDirection === "out" ? "change" : accountName ? addSpacingAroundText(accountName) : addSpacingAroundText(address)}</div>
                  <div className="txdetails-amount"><Balance amount={amount} /></div>
                </div>
              ))}
            </div>
            <div className="txdetails-output-area">
              <div className={nonWalletOutputs.length > 0 ? "txdetails-overview-title-consumed" : "txdetails-overview-title-empty"}>
                <T id="txDetails.nonWalletOutputs" m="Non Wallet Outputs" />
              </div>
              {nonWalletOutputs.map(({ address, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address non-wallet">{addSpacingAroundText(address)}</div>
                  <div className="txdetails-amount">{amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="txdetails-details">
        <div className="txdetails-title"><T id="txDetails.properties" m="Properties" /></div>
        {isConfirmed &&
          <Aux>
            <div className="txdetails-top-row">
              <div className="txdetails-name"><T id="txDetails.blockLabel" m="Block" /></div>
              <div className="txdetails-value">
                <a onClick={ openBlockUrl } style={{ cursor: "pointer" }}>{txBlockHash}</a>
              </div>
            </div>
            <div className="txdetails-top-row">
              <div className="txdetails-name"><T id="txDetails.blockHeightLabel" m="Height" /></div>
              <div className="txdetails-value">{txHeight}</div>
            </div>
          </Aux>
        }
        <div className="txdetails-top-row">
          <div className="txdetails-name"><T id="txDetails.rawTransactionLabel" m="Raw Transaction" /></div>
          <div className="txdetails-value"><div className="txdetails-value-rawtx">{rawTx}</div><CopyToClipboard textToCopy={rawTx} className="receive-content-nest-copy-to-clipboard-icon" /></div>
        </div>
      </div>
    </StandalonePage>
  );
};

export default transactionDetails(injectIntl(TxDetails));
