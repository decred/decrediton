import FloatInput from "./FloatInput";
import IntegerInput from "./IntegerInput";
import { MAX_DCR_AMOUNT, UNIT_DIVISOR } from "constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ATOMS } from "constants";
import * as sel from "selectors";

/**
 * DcrInput provides a way to receive decred amount inputs. Instead of the usual
 * value/onChange pair, it uses amount/onChangeAmount to track values in decred
 * atoms, correctly accounting for the currently used currencyDisplay, floating
 * conversions, etc.
 *
 * While the typed value is tracked in the internal state of this component,
 * users should ordinarily only use amount/onChangeAmount so that storing
 * and later re-displaying the value is consistent.
 */
function DcrInput({ onChangeAmount, amount, ...props }) {
  const [value, setValue] = useState(null);
  const currencyDisplay = useSelector(sel.currencyDisplay);

  useEffect(() => {
    if (amount === undefined || isNaN(amount)) {
      return;
    }
    // if amount is 0 or null, we set its value.
    if (!amount) {
      setValue(amount);
    }
  }, [amount]);
  // parseInput parses the passed amount and returns its respective atom
  // value.
  const parseInput = (amount) => {
    if (currencyDisplay === ATOMS) {
      return parseInt(amount, 10);
    }

    const atomsValue = strToDcrAtoms(amount, UNIT_DIVISOR);
    return atomsValue;
  };

  const onChange = (e) => {
    // set value which will be shown.
    const value = e.target.value;
    setValue(value);

    // get atom value as in decrediton we make use atoms for requests.
    const atomValue = parseInput(value);
    if (atomValue > MAX_DCR_AMOUNT) return;

    if (onChangeAmount) onChangeAmount({ ...e, value, atomValue });
  };

  // If UNIT_DIVISOR is 1 decrediton is being used in atoms.
  const Comp = currencyDisplay === ATOMS ? IntegerInput : FloatInput;
  return (
    <Comp
      {...props}
      unit={currencyDisplay}
      value={value}
      onChange={onChange}
      maxFracDigits={Math.log10(UNIT_DIVISOR)}
    />
  );
}

// Converts a string encoded as stdDecimalString (ie, a string protected by
// restrictToStdDecimalNumber) into a decred atom amount. This performs a
// conversion from a string into a JS number and then scales the number
// according to unitDivisor so the value represents an atom amount.
//
// Due to floating point inacuracies, a rounding function compatible to dcrutil
// `round` is used (see:
// https://github.com/decred/dcrd/blob/v1.1.2/dcrutil/amount.go#L77)
//
// Note that, since JS doesn't actually have an integer type (all numbers
// are floating-point numbers), the Math.trunc function is used to simulate
// the float64 -> int64 conversion.
//
// This is fine for representing numbers within the range of the total decred
// supply (up to 21e14) but may not be arbitrarily applicable.
function strToDcrAtoms(s, unitDivisor) {
  return Math.trunc(parseFloat(s) * unitDivisor + 0.5);
}

export default DcrInput;
