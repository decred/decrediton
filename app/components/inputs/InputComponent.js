import { FormattedMessage as T } from "react-intl";
import "style/Input.less";
import { isNullOrUndefined } from "util";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      inputUnitDiv: null,
      divClassName: "input-and-unit " + (this.props.className || "") + (this.props.disabled ? " disabled " : ""),
      inputPhase: 0,
      inputVal: "0.000000000",
      inputMain: "0.00",
      inputSub: "0000000"
    };
  }
  componentDidMount() {
    if (this.props.autoFocus) {
      this.input.focus();
    }
  }
  onInputFocus = (e) => {
    const { onFocus } = this.props;
    const { inputUnitDiv } = this.state;
    var updatedInputUnitDiv = inputUnitDiv;
    this.setState({ inputUnitDiv: updatedInputUnitDiv.classList.add("active") });
    onFocus && onFocus(e);
  };
  onInputBlur = (e) => {
    const { onBlur } = this.props;
    const { inputUnitDiv } = this.state;
    var updatedInputUnitDiv = inputUnitDiv;
    this.setState({ inputUnitDiv: updatedInputUnitDiv.classList.remove("active") });
    onBlur && onBlur(e);
  };
  onKeyDown = (e) => {
    const { onKeyDownSubmit, onKeyDown } = this.props;
    (e.keyCode === 13) && onKeyDownSubmit && onKeyDownSubmit(e);
    onKeyDown && !e.defaultPrevented && onKeyDown(e);
  }
  onKeyDown2 = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    const { onKeyDownSubmit, onKeyDown } = this.props;
    (e.keyCode === 13) && onKeyDownSubmit && onKeyDownSubmit(e);
    onKeyDown && !e.defaultPrevented && onKeyDown(e);
  }
  onChange = () => {
    this.setState({ inputPhase: 1 });
    var number = this.state.inputMain + this.state.inputSub;
    this.setState({ inputVal: number });
  };
  onChange2 = (e) => {
    this.setState({ inputPhase: 0 });
    var number = e.target.textContent;
    var number_f = parseFloat(number);
    var left_part = number_f.toFixed(2);
    var right_part_raw = number_f - left_part;
    var right_part_rounded = parseFloat(String(right_part_raw.toFixed(10)).slice(0, -1));

    var right_part = right_part_rounded * 100000000;

    // Used to compare value later
    var prepad = right_part_rounded * 100000000;

    right_part = right_part.toFixed(0);

    // Deduce rounding errors
    if (Math.floor(prepad) < right_part && Math.floor(prepad) == (parseInt(right_part)) - 1) {
      right_part = (parseInt(right_part)) - 1;
    }

    // Deduce rounding errors (upto 10 decimal places)
    else if (Math.floor(right_part_raw * 100000000) < right_part && Math.floor(right_part_raw * 100000000) == (parseInt(right_part)) - 1) {
      right_part = (parseInt(right_part)) - 1;
    }

    // Pad for numbers, so 0032 decimal will not turn to 32
    right_part = right_part.toString().padStart(6, "0");

    if (right_part <= 0) {
      right_part = "000000";
    }

    // Reset back to numbers
    if (isNaN(left_part) == true || isNaN(right_part) == true) {
      left_part = "0.00";
      right_part = "000000";
    }

    this.setState({ inputMain: left_part });
    this.setState({ inputSub: right_part });

    // Send to other older previous unstyled component
    this.setState({ inputValue: number_f });
  };

  render() {
    const {
      showErrors,
      invalidMessage,
      requiredMessage,
      required,
      invalid,
      value,
      placeholder,
      onChange,
      disabled,
      readOnly,
      unit,
      hidden,
      type,
    } = this.props;
    return (
      hidden ? null :
        <Aux>
          <input id="parsedInput"
            style={{ display: "none" }}
            ref={input => { this.input = input; }}
            type="number"
            className="input"
            disabled={disabled ? disabled : null}
            readOnly={readOnly ? readOnly : null}
            placeholder={placeholder}
            value={isNullOrUndefined(value) ? "" : this.state.inputVal}
            onChange={onChange}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            onKeyDown={this.onKeyDown}
          />
          <div className={showErrors && (invalid && value || required && !value) ? this.state.divClassName + " error" : this.state.divClassName} ref={div => { this.state.inputUnitDiv = div; }}>
            <div contentEditable="true"
              ref={input => { this.input = input; }}
              type={type || "text"}
              className="input"
              disabled={disabled ? disabled : null}
              readOnly={readOnly ? readOnly : null}
              placeholder={placeholder}
              value={isNullOrUndefined(value) ? "" : value}
              onChange={this.sendToParser}
              onFocus={this.onChange}
              onBlur={this.onChange2}
              onKeyDown={this.onKeyDown2}
            >
              <span id="parsedInputDisplay" style={{ marginTop: "2px" }}
                className={"parsedInput-" + this.state.inputPhase}
                onKeyDown={this.onKeyDown2}
              >{this.state.inputVal}</span>
              <div id="viewInputDisplay" className={"viewInput-" + this.state.inputPhase}>
                <span
                  type="number" id="input-main" className="input-main">{this.state.inputMain}</span>
                <span type="number" id="input-sub" className="input-sub">{this.state.inputSub}</span>
              </div>
            </div>
            {unit && !(showErrors && ((invalid && value) || (required && !value))) ? <div className="unit-area">{unit}</div> : null}
          </div>
          {showErrors ? (
            <div className="input-errors-area">
              {invalid && value ? (
                <div className="input-error">
                  {invalidMessage ? invalidMessage :
                    <T id="input.invalidInput" m="This field is wrong" />}
                </div>
              ) : null}
              {required && !value ? (
                <div className="input-error">
                  {requiredMessage ? requiredMessage :
                    <T id="input.requiredInput" m="This field is required" />}
                </div>
              ) : null}
            </div>
          ) : null}
        </Aux>
    );
  }
}

export default Input;
