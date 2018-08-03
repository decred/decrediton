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
      divClassName: "input-and-unit " + (this.props.className || "") + (this.props.disabled ? " disabled " : "")
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
    var number =
      (document.getElementById("input-main").innerHTML)
      + (document.getElementById("input-sub").innerHTML);
    document.getElementById("parsedInputDisplay").innerHTML = number;
    document.getElementById("parsedInputDisplay").style.display = "inherit";
    document.getElementById("viewInputDisplay").style.display = "none";
  };
  onChange2 = () => {
    var number = document.getElementById("parsedInputDisplay").innerHTML;
    var number_f = parseFloat(number);
    var left_part = number_f.toFixed(2);
    var right_part_raw = number_f - left_part;
    var right_part_rounded = parseFloat(String(right_part_raw.toFixed(10)).slice(0, -1));

    var right_part = right_part_rounded * 100000000;

    // Used to compare value later
    var prepad = right_part_rounded * 100000000;

    right_part = right_part.toFixed(0);

    // Deduce rounding errors
    if (Math.floor(prepad) < right_part && Math.floor(prepad) == (parseInt(right_part)) - 1 ) {
      right_part = (parseInt(right_part)) - 1;
    }

    // Deduce rounding errors (upto 10 decimal places)
    else if (Math.floor(right_part_raw * 100000000) < right_part && Math.floor(right_part_raw * 100000000) == (parseInt(right_part)) - 1) {
      right_part = (parseInt(right_part)) - 1;
    }

    // Pad for numbers, so 0032 decimal will not turn to 32
    right_part = pad(String(right_part), 6);

    if (right_part <= 0) {
      right_part = "000000";
    }

    // Reset back to numbers
    if (isNaN(left_part) == true || isNaN(right_part) == true) {
      left_part = "0.00";
      right_part = "000000";
    }

    document.getElementById("input-main").innerHTML = left_part;
    document.getElementById("input-sub").innerHTML = right_part;

    // Send to other older previous unstyled component and trigger event
    document.getElementById("parsedInput").value = number_f;
    var event = new Event("input", { bubbles: true });
    var x = document.getElementById("parsedInput");
    var tracker = x._valueTracker;
    tracker.setValue("'" + x.value + "'");
    x.dispatchEvent(event);

    document.getElementById("parsedInputDisplay").style.display = "none";
    document.getElementById("viewInputDisplay").style.display = "inherit";
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
            value={isNullOrUndefined(value) ? "" : value}
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
              onMouseOver={this.onChange}
              onBlur={this.onChange2}
              onKeyDown={this.onKeyDown2}
            >
              <span id="parsedInputDisplay" style={{ display: "none", marginTop: "2px;" }}
                onKeyDown={this.onKeyDown2}
              ></span>
              <div id="viewInputDisplay">
                <span

                  type="number" id="input-main" className="input-main">0.00</span>
                <span type="number" id="input-sub" className="input-sub">0000000</span>
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

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

export default Input;
