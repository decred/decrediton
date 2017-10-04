import React from "react";
import "../style/Balance.less";
import { FormattedMessage } from "react-intl";
import balanceConnector from "../connectors/balance";

export const Balance = ({ currencyDisplay, amount, onClick }) => {
  if (currencyDisplay === "DCR") {
    var totalDcr = 0;
    var numberFormatPart = ["0","0"];
    if (typeof amount !== "undefined" && amount !== 0) {
      totalDcr = parseInt(amount) / 100000000;
      numberFormatPart = totalDcr.toFixed(8).toString().split(".");
    }
    return (
      <span
        className="balance-base"
        onClick={onClick}
      >
        <FormattedMessage
          id="balance.dcr"
          defaultMessage="{amount, number, two-decimals}{smallAmount} {unit}"
          values={{
            amount: numberFormatPart[0]+"."+numberFormatPart[1].toString().slice(0,2),
            smallAmount:
              <span className="balance-small">
                {numberFormatPart[1].toString().slice(2)}
              </span>,
            unit: <span className="balance-small">DCR</span>
          }}
          />
      </span>
    );
  } else if (currencyDisplay === "atoms") {
    return (
      <span
      className="balance-base"
      onClick={onClick}
      >
        <FormattedMessage
          id="balance.atoms"
          defaultMessage="{amount} {unit}"
          values={{
            amount: amount,
            unit: <span className="balance-small"> atoms</span>
          }} />
      </span>
    );
  }
};

export default balanceConnector(Balance);
