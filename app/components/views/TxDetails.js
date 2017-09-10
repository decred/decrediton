// @flow
import React from "react";
import Radium from "radium";
import Balance from "../Balance";
import Header from "../Header";
import { shell } from "electron";
import dateFormat from "dateformat";
import transactionDetails from "../../connectors/transactionDetails";
import SlateGrayButton from "../SlateGrayButton";
import { TxDetailsStyles } from "./ViewStyles";
import { addSpacingAroundText } from "../../helpers/strings";
import "../fonts.css";

const getHeaderStyle = txDirection => ({
  out: TxDetailsStyles.headerMetaTransactionDetailsOut,
  transfer: TxDetailsStyles.headerMetaTransactionDetailsTransfer,
  in: TxDetailsStyles.headerMetaTransactionDetailsIn
})[txDirection];

const getFormattedDate = timestamp => dateFormat(new Date(timestamp*1000), "mmm d yyyy, HH:MM:ss");

const TxDetails = ({
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
    txTimestamp
  },
  currentBlockHeight,
  onClearTxDetail
}) => (
  <div style={TxDetailsStyles.view}>
    <Header
      headerTitleOverview={<SlateGrayButton key="back" style={{float: "right"}} onClick={onClearTxDetail}>back</SlateGrayButton>}
      headerMetaOverview={txType ? (
        <div style={TxDetailsStyles.headerMetaTransactionDetailsStakeTx}>
          {txType}
          <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{getFormattedDate(txTimestamp)}</div>
        </div>
      ) : (
        <div style={getHeaderStyle(txDirection)}>
          {txDirection === "in" ? "" : "-"}<Balance amount={txAmount} />
          <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{getFormattedDate(txTimestamp)}</div>
        </div>
      )}
    />
    <div style={TxDetailsStyles.content}>
      <div style={TxDetailsStyles.contentNest}>
        <div style={TxDetailsStyles.transactionDetailsTop}>
          <div style={TxDetailsStyles.transactionDetailsName}>Transaction:</div>
          <div style={TxDetailsStyles.transactionDetailsValue}>
            <a onClick={() => shell.openExternal(txUrl)} style={{cursor: "pointer"}}>{txHash}</a>
          </div>
          <div style={TxDetailsStyles.transactionDetailsName}>
            <div style={TxDetailsStyles.indicatorConfirmed}>confirmed</div>
          </div>
          <div style={TxDetailsStyles.transactionDetailsValue}>{currentBlockHeight - txHeight} <span style={TxDetailsStyles.transactionDetailsValueText}>confirmations</span></div>
          <div style={TxDetailsStyles.transactionDetailsOverview}>
            <div style={TxDetailsStyles.transactionDetailsOverviewTitle}>
              <div style={TxDetailsStyles.transactionDetailsOverviewTitleConsumed}>Used Inputs</div>
              <div style={TxDetailsStyles.transactionDetailsOverviewTitleCreated}>New Wallet Outputs</div>
            </div>
            <div style={TxDetailsStyles.transactionDetailsInputArea}>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} style={TxDetailsStyles.transactionDetailsRow}>
                  <div style={TxDetailsStyles.transactionDetailsAddress}>{accountName}</div>
                  <div style={TxDetailsStyles.transactionDetailsAmount}><Balance amount={amount}/></div>
                </div>
              ))}
            </div>
            <div style={TxDetailsStyles.transactionDetailsOutputArea}>
              {txOutputs.map(({ address, amount }, idx) => (
                <div key={idx} style={TxDetailsStyles.transactionDetailsRow}>
                  <div style={TxDetailsStyles.transactionDetailsAddress}>{addSpacingAroundText(address)}</div>
                  <div style={TxDetailsStyles.transactionDetailsAmount}><Balance amount={amount}/></div>
                </div>
              ))}
            </div>
          </div>
          <div style={TxDetailsStyles.transactionDetailsName}>Transaction fee:</div>
          <div style={TxDetailsStyles.transactionDetailsValue}><Balance amount={txFee} />
          </div>
        </div>
        <div style={TxDetailsStyles.transactionDetails}>
          <div style={TxDetailsStyles.transactionDetailsTitle}>Properties</div>
          <div style={TxDetailsStyles.transactionDetailsName}>Block:</div>
          <div style={TxDetailsStyles.transactionDetailsValue}>
            <a onClick={() => shell.openExternal(txBlockUrl)} style={{cursor: "pointer"}}>{txBlockHash}</a>
          </div>
          <div style={TxDetailsStyles.transactionDetailsName}>Height:</div>
          <div style={TxDetailsStyles.transactionDetailsValue}>{txHeight}</div>
        </div>
      </div>
    </div>
  </div>
);

export default transactionDetails(Radium(TxDetails));
