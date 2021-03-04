import { FormattedNumber } from "react-intl";
import { useBalance } from "./hooks";
import { DCR, UNIT_DIVISOR } from "constants";
import { classNames } from "pi-ui";
import styles from "./Balance.module.css";

export const Balance = ({
  amount,
  onClick,
  bold,
  large,
  flat,
  title,
  noSmallAmount,
  classNameWrapper,
  classNameUnit,
  preScaled,
  hideCurrency,
  classNameAmount
}) => {
  const { currencyDisplay } = useBalance();
  const secondary = large ? "tiny" : flat ? "base" : title ? "title" : "small";
  if (currencyDisplay === DCR) {
    let totalDcr = 0;
    if (amount && !isNaN(amount)) {
      totalDcr = preScaled
        ? parseFloat(amount)
        : parseInt(amount) / UNIT_DIVISOR;
    }
    const split = totalDcr.toFixed(8).toString().split(".");
    const head = [split[0], split[1].slice(0, 2)].join(".");
    const tail = split[1].slice(2).replace(/0{1,3}$/, "");
    return (
      <div className={classNameWrapper}>
        <span {...{ onClick }}>
          <span className={classNames(classNameAmount, bold && "bold")}>
            <FormattedNumber
              value={head}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
            />
          </span>
          {!noSmallAmount && (
            <span
              className={classNames(
                styles[secondary],
                classNameUnit,
                bold && "bold"
              )}>
              {`${tail} `}
            </span>
          )}
          {!hideCurrency && (
            <span
              className={classNames(styles[secondary], classNameUnit)}>
              DCR
            </span>
          )}
        </span>
      </div>
    );
  }
  // currencyDisplay === ATOMS
  return (
    <div className={classNameWrapper}>
      <span className="mono" {...{ onClick }}>
        <span className={classNames(styles[secondary], bold && "bold")}>
          <FormattedNumber
            value={amount && !isNaN(amount) ? amount : 0}
            maximumFractionDigits={0}
            minimumFractionDigits={0}
          />
        </span>
        {!hideCurrency && (
          <span
            className={classNames(styles[secondary], classNameUnit)}>
            {" "}
            atoms
          </span>
        )}
      </span>
    </div>
  );
};

export default Balance;
