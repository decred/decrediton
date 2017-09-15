// @flow
import React from "react";
import Balance from "../Balance";
import Header from "../Header";
import { shell } from "electron";
import dateFormat from "dateformat";
import transactionDetails from "../../connectors/transactionDetails";
import SlateGrayButton from "../SlateGrayButton";
import "../../style/Layout.less";
import "../../style/TxDetails.less";
import { addSpacingAroundText } from "../../helpers/strings";
import "../../style/Fonts.less";

const getHeaderClassName = txDirection => ({
  out: "txdetails-header-meta-out",
  transfer: "txdetails-header-meta-transfer",
  in: "txdetails-header-meta-in"
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
  <div className="page-view">
    <Header
      headerTitleOverview={<SlateGrayButton key="back" style={{float: "right"}} onClick={onClearTxDetail}>back</SlateGrayButton>}
      headerMetaOverview={txType ? (
        <div className="txdetails-header-meta-stake-tx">
          {txType}
          <div className="txdetails-header-meta-time-and-date">{getFormattedDate(txTimestamp)}</div>
        </div>
      ) : (
        <div className={getHeaderClassName(txDirection)}>
          {txDirection === "in" ? "" : "-"}<Balance amount={txAmount} />
          <div className="txdetails-header-meta-time-and-date">{getFormattedDate(txTimestamp)}</div>
        </div>
      )}
    />
    <div className="page-content">
      <div className="txdetails-content-nest">
        <div className="txdetails-top">
          <div className="txdetails-name">Transaction:</div>
          <div className="txdetails-value">
            <a onClick={() => shell.openExternal(txUrl)} style={{cursor: "pointer"}}>{txHash}</a>
          </div>
          <div className="txdetails-name">
            <div className="txdetails-indicator-confirmed">confirmed</div>
          </div>
          <div className="txdetails-value">{currentBlockHeight - txHeight} <span className="txdetails-value-text">confirmations</span></div>
          <div className="txdetails-overview">
            <div className="txdetails-input-area">
              <div className="txdetails-overview-title-consumed">Used Inputs</div>
              <div className="txdetails-input-arrow"></div>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">{accountName}</div>
                  <div className="txdetails-amount"><Balance amount={amount}/></div>
                </div>
              ))}
            </div>
            <div className="txdetails-output-area">
              <div className="txdetails-overview-title-created">New Wallet Outputs</div>
              {txOutputs.map(({ address, amount }, idx) => (
                <div key={idx} className="txdetails-row">
                  <div className="txdetails-address">{addSpacingAroundText(address)}</div>
                  <div className="txdetails-amount"><Balance amount={amount}/></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="txdetails-name">Transaction fee:</div>
            <div className="txdetails-value"><Balance amount={txFee} /></div>
          </div>
        </div>
        <div className="txdetails-details">
          <div className="txdetails-title">Properties</div>
          <div className="txdetails-name">Block:</div>
          <div className="txdetails-value">
            <a onClick={() => shell.openExternal(txBlockUrl)} style={{cursor: "pointer"}}>{txBlockHash}</a>
          </div>
          <div className="txdetails-name">Height:</div>
          <div className="txdetails-value">{txHeight}</div>
        </div>
      </div>
    </div>
  </div>
);

export default transactionDetails(TxDetails);
