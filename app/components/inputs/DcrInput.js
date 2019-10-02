import FloatInput from "./FloatInput";
import IntegerInput from "./IntegerInput";
import { strToDcrAtoms } from "helpers/strings";
import balanceConnector from "connectors/balance";
import { DCR, MAX_DCR_AMOUNT } from "constants";

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

/**
 * DcrInput provides a way to receive decred amount inputs. Instead of the usual
 * value/onChange pair, it uses amount/onChangeAmount to track values in decred
 * atoms, correctly accounting for the currently used currencyDisplay, floating
 * convertions, etc.
 *
 * It tracks 2 different values: the typed input in the text box (which may
 * contain decimal and eventually thousands separator) and the actual input
 * amount in **ATOMS** (as required by various wallet operations).
 */
@autobind
class DcrInput extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange(e) {
    const { unitDivisor, currencyDisplay, onChange } = this.props;
    let amount;
    const value = e.target.value;
    if (value) {
      // pre-validate if <= max supply
      amount = currencyDisplay === DCR ? value*unitDivisor : strToDcrAtoms(value, unitDivisor);

      if (amount > MAX_DCR_AMOUNT) return;
    }
    if (onChange) onChange({ ...e, value, atomValue: amount });
  }

  render() {
    const { unitDivisor, currencyDisplay } = this.props;
    const maxFracDigits = Math.log10(unitDivisor);

    const Comp = unitDivisor !== 1 ? FloatInput : IntegerInput;
    return <Comp
      {...this.props}
      unit={currencyDisplay}
      value={this.props.amount}
      onChange={this.onChange}
      maxFracDigits={maxFracDigits}
    />;
  }
}

export default balanceConnector(DcrInput);
