// @flow
import Balance from "../Balance";
import { TabbedHeader } from "shared";
import { shell } from "electron";
import { transactionDetails } from "connectors";
import SlateGrayButton from "../SlateGrayButton";
import "style/TxDetails.less";
import { tsToDate, addSpacingAroundText } from "helpers";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
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

const TxDetails = ({ routes, router,
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
                   }) => {
  const isConfirmed = !!txTimestamp;
  const icon = headerIcons[txType || txDirection];
  const title = txType ? intl.formatMessage(messages[txType]) : <div className="txdetails-header-title">{txDirection === "in" ? "" : "-"}<Balance title bold amount={txAmount}/></div>;
  const subtitle = isConfirmed && <T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsToDate(txTimestamp) }}/>;
  const goBack = () => router.goBack();
  const openTxUrl = () => shell.openExternal(txUrl);
  const openBlockUrl = () => shell.openExternal(txBlockUrl);

  return (
    <Aux>
      <TabbedHeader {...{ routes, icon, title, subtitle }}>
        <SlateGrayButton onClick={ goBack }>
          <T id="txDetails.backBtn" m="Back" />
        </SlateGrayButton>
      </TabbedHeader>
      <div className="page-content">
        <div className="txdetails-content-nest">
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
                  values={{confirmations: (isConfirmed ? currentBlockHeight - txHeight : 0)}} />
              </span>
            </div>
            <div className="txdetails-overview">
              <div className="txdetails-input-area">
                <div className="txdetails-overview-title-consumed">
                  <T id="txDetails.usedInputs" m="Used Inputs" />
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
                  <T id="txDetails.walletOutputs" m="New Wallet Outputs" />
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
              <div className="txdetails-name"><T id="txDetails.transactionFeeLabel" m="Transaction fee" />:</div>
              <div className="txdetails-value"><Balance amount={txFee} /></div>
            </div>
          </div>
          {isConfirmed ?
            <div className="txdetails-details">
              <div className="txdetails-title"><T id="txDetails.properties" m="Properties" /></div>
              <div className="txdetails-name"><T id="txDetails.blockLabel" m="Block" />:</div>
              <div className="txdetails-value">
                <a onClick={ openBlockUrl } style={{ cursor: "pointer" }}>{txBlockHash}</a>
              </div>
              <div className="txdetails-name"><T id="txDetails.blockHeightLabel" m="Height" /> :</div>
              <div className="txdetails-value">{txHeight}</div>
            </div>
            : null
          }
        </div>
      </div>
    </Aux>
  );
};

export default transactionDetails(injectIntl(TxDetails));
