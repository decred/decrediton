// @flow
import React from "react";
import PropTypes from "prop-types";
import Balance from "../Balance";
import Header from "../Header";
import { shell } from "electron";
import transactionDetails from "../../connectors/transactionDetails";
import SlateGrayButton from "../SlateGrayButton";
import "../../style/Layout.less";
import "../../style/TxDetails.less";
import { addSpacingAroundText } from "../../helpers/strings";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import { tsToDate } from "../../helpers/dateFormat";
import "../../style/Fonts.less";

const messages = defineMessages({
  Ticket: {
    id: "transaction.type.ticket",
    defaultMessage: "Ticket"
  },
  Vote: {
    id: "transaction.type.vote",
    defaultMessage: "Vote"
  },
  Revocation: {
    id: "transaction.type.revoke",
    defaultMessage: "Revoke"
  }
});

const getHeaderClassName = txDirection => ({
  out: "txdetails-header-meta-out",
  transfer: "txdetails-header-meta-transfer",
  in: "txdetails-header-meta-in"
})[txDirection];

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
                     intl
                   }, { router }) => {
  const isConfirmed = !!txTimestamp;

  return (
    <div className="page-view">

      <Header
        headerTitleOverview={<SlateGrayButton key="back" style={{ float: "right" }} onClick={() => router.goBack()}>
          <FormattedMessage id="txDetails.backBtn" defaultMessage="Back" /></SlateGrayButton>}
        headerMetaOverview={txType ? (
          <div className="txdetails-header-meta-stake-tx">
            {intl.formatMessage(messages[txType])}
            { isConfirmed
                ? <div className="txdetails-header-meta-time-and-date">
                    <FormattedMessage id="txDetails.timestamp"
                      defaultMessage="{timestamp, date, medium} {timestamp, time, medium}"
                      values={{timestamp: tsToDate(txTimestamp)}}
                    /></div>
                : null }
          </div>
        ) : (
          <div className={getHeaderClassName(txDirection)}>
            {txDirection === "in" ? "" : "-"}<Balance amount={txAmount} />
            { isConfirmed
              ? <div className="txdetails-header-meta-time-and-date">
                  <FormattedMessage id="txDetails.timestamp"
                      defaultMessage="{timestamp, date, medium} {timestamp, time, medium}"
                      values={{timestamp: tsToDate(txTimestamp)}}
                    /></div>
              : null }
          </div>
        )}
      />
      <div className="page-content">
        <div className="txdetails-content-nest">
          <div className="txdetails-top">
            <div className="txdetails-name">
              <FormattedMessage id="txDetails.transactionLabel" defaultMessage="Transaction" />:
            </div>
            <div className="txdetails-value">
              <a onClick={() => shell.openExternal(txUrl)} style={{ cursor: "pointer" }}>{txHash}</a>
            </div>
            <div className="txdetails-name">
              {isConfirmed ? (<div className="txdetails-indicator-confirmed">
                <FormattedMessage id="transaction.indicatorConfirmed" defaultMessage="Confirmed" />
              </div>) : (<div className="txdetails-indicator-pending">
                <FormattedMessage id="transaction.indicatorPending" defaultMessage="Pending" /></div>)}
            </div>
            <div className="txdetails-value">
              <span className="txdetails-value-text">
                <FormattedMessage id="transaction.confirmationHeight"
                  defaultMessage="{confirmations, plural, =0 {pending} one {# confirmation} other {# confirmations}}"
                  values={{confirmations: (isConfirmed ? currentBlockHeight - txHeight : 0)}} />
              </span>
            </div>
            <div className="txdetails-overview">
              <div className="txdetails-input-area">
                <div className="txdetails-overview-title-consumed">
                  <FormattedMessage id="txDetails.usedInputs" defaultMessage="Used Inputs" />
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
                  <FormattedMessage id="txDetails.walletOutputs" defaultMessage="New Wallet Outputs" />
                </div>
                {txOutputs.map(({ address, amount }, idx) => (
                  <div key={idx} className="txdetails-row">
                    <div className="txdetails-address">{addSpacingAroundText(address)}</div>
                    <div className="txdetails-amount"><Balance amount={amount} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="txdetails-name"><FormattedMessage id="txDetails.transactionFeeLabel" defaultMessage="Transaction fee" />:</div>
              <div className="txdetails-value"><Balance amount={txFee} /></div>
            </div>
          </div>
          {isConfirmed ?
            <div className="txdetails-details">
              <div className="txdetails-title"><FormattedMessage id="txDetails.properties" defaultMessage="Properties" /></div>
              <div className="txdetails-name"><FormattedMessage id="txDetails.blockLabel" defaultMessage="Block" />:</div>
              <div className="txdetails-value">
                <a onClick={() => shell.openExternal(txBlockUrl)} style={{ cursor: "pointer" }}>{txBlockHash}</a>
              </div>
              <div className="txdetails-name"><FormattedMessage id="txDetails.blockHeightLabel" defaultMessage="Height" /> :</div>
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

export default transactionDetails(injectIntl(TxDetails));
