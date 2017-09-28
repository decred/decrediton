// @flow
import React from "react";
import PropTypes from "prop-types";
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

const getFormattedDate = timestamp => timestamp ? dateFormat(new Date(timestamp*1000), "mmm d yyyy, HH:MM:ss") : "N/A";

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
                   }, { router }) => {
  const isConfirmed = !!txTimestamp;

  return (
    <div className="page-view">

      <Header
        headerTitleOverview={<SlateGrayButton key="back" style={{ float: "right" }} onClick={() => router.goBack()}>back</SlateGrayButton>}
        headerMetaOverview={txType ? (
          <div className="txdetails-header-meta-stake-tx">
            {txType}
            { isConfirmed ? <div className="txdetails-header-meta-time-and-date">{getFormattedDate(txTimestamp)}</div> : null }
          </div>
        ) : (
          <div className={getHeaderClassName(txDirection)}>
            {txDirection === "in" ? "" : "-"}<Balance amount={txAmount} />
            { isConfirmed ? <div className="txdetails-header-meta-time-and-date">{getFormattedDate(txTimestamp)}</div> : null }
          </div>
        )}
      />
      <div className="page-content">
        <div className="txdetails-content-nest">
          <div className="txdetails-top">
            <div className="txdetails-name">Transaction:</div>
            <div className="txdetails-value">
              <a onClick={() => shell.openExternal(txUrl)} style={{ cursor: "pointer" }}>{txHash}</a>
            </div>
            <div className="txdetails-name">
              {isConfirmed ? (<div className="txdetails-indicator-confirmed">confirmed</div>) : (<div className="txdetails-indicator-pending">Pending</div>)}
            </div>
            <div className="txdetails-value">{isConfirmed ? currentBlockHeight - txHeight : 0} <span className="txdetails-value-text">confirmations</span></div>
            <div className="txdetails-overview">
              <div className="txdetails-input-area">
                <div className="txdetails-overview-title-consumed">Used Inputs</div>
                <div className="txdetails-input-arrow"></div>
                {txInputs.map(({ accountName, amount }, idx) => (
                  <div key={idx} className="txdetails-row">
                    <div className="txdetails-address">{accountName}</div>
                    <div className="txdetails-amount"><Balance amount={amount} /></div>
                  </div>
                ))}
              </div>
              <div className="txdetails-output-area">
                <div className="txdetails-overview-title-created">New Wallet Outputs</div>
                {txOutputs.map(({ address, amount }, idx) => (
                  <div key={idx} className="txdetails-row">
                    <div className="txdetails-address">{addSpacingAroundText(address)}</div>
                    <div className="txdetails-amount"><Balance amount={amount} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="txdetails-name">Transaction fee:</div>
              <div className="txdetails-value"><Balance amount={txFee} /></div>
            </div>
          </div>
          {isConfirmed ?
            <div className="txdetails-details">
              <div className="txdetails-title">Properties</div>
              <div className="txdetails-name">Block:</div>
              <div className="txdetails-value">
                <a onClick={() => shell.openExternal(txBlockUrl)} style={{ cursor: "pointer" }}>{txBlockHash}</a>
              </div>
              <div className="txdetails-name">Height:</div>
              <div className="txdetails-value">{txHeight}</div>
            </div>
            : null
          }
        </div>
      </div>
    </div>
  );
};

TxDetails.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default transactionDetails(TxDetails);
