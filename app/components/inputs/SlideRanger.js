import { Tooltip } from "shared";
import { strToDcrAtoms } from "helpers/strings";
import balanceConnector from "connectors/balance";
import "style/Input.less";

@autobind
class SlideRanger extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      max: props.max,
      min: props.min,
    };
  }

  onChangeValue(e) {
    const { unitDivisor } = this.props;
    const { value } = e.target;
    const amount = !value ? 0 : strToDcrAtoms(value, unitDivisor);
    this.setState({ value: amount });
    this.props.onChange && this.props.onChange(amount);
  }

  render() {
    const { min, max, value, step } = this.props;
    const { onChangeValue } = this;
    return (
      <Tooltip text={value}>
        <input type="range" step={step} min={min} max={max} value={value} onChange={onChangeValue} onMouseUp={onChangeValue} />
      </Tooltip>
    );
  }
}

export default balanceConnector(SlideRanger);
