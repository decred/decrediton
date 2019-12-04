import FloatInput from "./FloatInput";
import IntegerInput from "./IntegerInput";
import { strToDcrAtoms } from "helpers/strings";
import balanceConnector from "connectors/balance";
import { MAX_DCR_AMOUNT } from "constants";

/**
 * FixedDcrInput is a simple numeric input that is assumed to **always** hold
 * a floating point number representing a DCR amount (ie, an amount that
 * will be mutiplied by 1e8 to get to the actual atoms value).
 *
 * This is **not** affected by the global currencyDisplay state.
 *
 * Whenever possible, use the DcrInput component, as it is more flexible and
 * already manages the underlying input value in atoms.
 */
export const FixedDcrInput = ({ currencyDisplay, ...props }) =>
  <FloatInput {...{ ...props, unit: currencyDisplay, maxFracDigits: 8 }} />;

function countDecimalDigits(s) {
  for (let i = s.length-1; i >= 0; i--) {
    if (s[i] === ".") return s.length - i - 1;
  }
  return 0;
}

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
@autobind
class DcrInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decimal: false,
      decimalDigits: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.amount !== prevProps.amount && !this.props.amount && this.props.amount !== 0) {
      // Amount just got cleared, so clear decimalDigits as well to display a
      // blank input.
      this.setState({ decimalDigits: 0 });
    }
  }

  // amountToDisplayStr converts the given amount in atoms to the appropriate
  // string to display given the current config of this input.
  amountToDisplayStr(amount) {
    if (!amount) {
      if (this.state.decimal) {
        return "0.";
      } else if (this.state.decimalDigits) {
        return (0).toFixed(this.state.decimalDigits);
      }
      return amount;
    }
    const { unitDivisor } = this.props;
    let scaled = amount / unitDivisor;
    if (this.state.decimal) {
      return scaled.toFixed(0) + ".";
    }
    return scaled.toFixed(this.state.decimalDigits);
  }

  // typedValueToAmount converts the given string value typed into the input to
  // the appropriate atom amount.
  typedValueToAmount(value) {
    return strToDcrAtoms(value, this.props.unitDivisor);
  }

  onChange(e) {
    const { onChangeAmount } = this.props;
    let amount;
    const value = e.target.value;
    const decimal = value && value.length > 0 && value[value.length-1] == ".";
    const decimalDigits = countDecimalDigits(value);
    if (value) {
      amount = this.typedValueToAmount(value);

      // Pre-validate if <= max supply
      if (amount > MAX_DCR_AMOUNT) return;
    }
    if (onChangeAmount) onChangeAmount({ ...e, value, atomValue: amount });
    this.setState({ decimal, decimalDigits });
  }

  render() {
    const { unitDivisor, currencyDisplay } = this.props;
    const maxFracDigits = Math.log10(unitDivisor);

    const Comp = unitDivisor !== 1 ? FloatInput : IntegerInput;
    return <Comp
      {...this.props}
      unit={currencyDisplay}
      value={this.amountToDisplayStr(this.props.amount)}
      onChange={this.onChange}
      maxFracDigits={maxFracDigits}
    />;
  }
}

export default balanceConnector(DcrInput);
