import FloatInput from "./FloatInput";
import IntegerInput from "./IntegerInput";
import { strToDcrAtoms } from "helpers/strings";
import balanceConnector from "connectors/balance";

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
    this.state = {value: this.amountToDisplayStr(props.amount)};
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.amount && !this.state.value) {
      //ignore when emptying or setting to 0
      return;
    }

    if (nextProps.amount !== this.props.amount) {
      this.setState({value: this.amountToDisplayStr(nextProps.amount)});
    }
  }

  amountToDisplayStr(amount) {
    if (!amount) return amount;
    const { unitDivisor } = this.props;
    return amount / unitDivisor;
  }

  changeAmount(value) {
    const { unitDivisor } = this.props;
    const amount = !value ? 0 : strToDcrAtoms(value, unitDivisor);
    if (amount !== this.props.amount) {
      this.props.onChangeAmount && this.props.onChangeAmount(amount);
    }
  }

  onChange(e) {
    const value = e.target.value;
    if (value !== this.state.value) {
      this.setState({value}, () => this.changeAmount(value));
    }
  }

  render() {
    const { unitDivisor, currencyDisplay } = this.props;
    const { value } = this.state;
    const { onChange } = this;
    const maxFracDigits = Math.log10(unitDivisor);

    const Comp = unitDivisor !== 1 ? FloatInput : IntegerInput;
    return <Comp
        {...this.props}
        unit={currencyDisplay}
        value={value}
        onChange={onChange}
        maxFracDigits={maxFracDigits}
      />;
  }
}

export default balanceConnector(DcrInput);
