import { FormattedMessage as T } from "react-intl";
import ValidateAddressForm from "./Form";
import { validateAddressPage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class ValidateAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return ({
      address: "",
      error: null,
    });
  }

  componentWillMount () {
    this.props.validateAddressCleanStore();
  }

  componentWillUnmount() {
    this.props.validateAddressCleanStore();
  }

  render() {
    const { validateAddressSuccess } = this.props;
    const { address, error } = this.state;
    const { onAddressChange, onAddressBlur } = this;

    let result = null;
    if (validateAddressSuccess) {
      const isValid = validateAddressSuccess.isValid;
      let isValidDisplay = null;
      if (isValid) {
        const isMine = validateAddressSuccess.isMine;
        if (isMine) {
          isValidDisplay = <T id="securitycenter.validate.result.owned" m="Owned address!" />;
        } else {
          isValidDisplay = <T id="securitycenter.validate.result.notOwned" m="Not owned address!" />;
        }
      } else {
        isValidDisplay = <T id="securitycenter.validate.result.invalid" m="Invalid address!" />;
      }

      result = (
        <div className="message-nest">
          <div className={`message-content ${isValid ? "valid" : "invalid"}`}>
            {isValidDisplay}
          </div>
        </div>
      );
    } else if (error) {
      result = (
        <div className="message-nest">
          <div className="message-content invalid">
            <div className="message-content-invalid-message">
              <T id="securitycenter.validate.result.invalid" m="Invalid address!" />
            </div>
            <div className="message-content-invalid-message-error">
              {error}
            </div>
          </div>
        </div>
      );

    }

    return (
      <div className="message message-verify">
        <ValidateAddressForm {...{ onAddressChange, onAddressBlur, address, result }}/>
      </div>
    );
  }

  onAddressChange(address) {
    if (address == "") {
      this.setState({ address, error: null });
      return;
    }
    this.props.validateAddress(address)
      .then(resp => {
        this.setState({ address, error: !resp.getIsValid() ? "Please enter a valid address" : null });
      })
      .catch(error => {
        console.error(error);
        this.setState({ address, error: "Error: Address validation failed, please try again." });
      });
  }
}

export default validateAddressPage(ValidateAddress);
