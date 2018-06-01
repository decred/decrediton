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
      const isMine = validateAddressSuccess.isMine;
      let isValidDisplay = null;
      if (isValid) {
        if (isMine) {
          isValidDisplay = <T id="securitycenter.validate.result.owned" m="Owned address" />;
        } else {
          isValidDisplay = <T id="securitycenter.validate.result.notOwned" m="Address Valid, Not Owned" />;
        }
      } else {
        isValidDisplay = <T id="securitycenter.validate.result.invalid" m="Invalid address" />;
      }

      result = (
        <div className={`validate-address-form-address-response ${isMine ? "owned" : "not-owned"} ${isValid ? "valid" : "invalid"}`}>
          {isValidDisplay}
        </div>
      );
    } else if (error) {
      result = (
        <div className={"validate-address-form-address-response invalid"}>
          <T id="securitycenter.validate.result.invalid" m="Invalid address" />
        </div>
      );
    }

    return (
      <ValidateAddressForm {...{ onAddressChange, onAddressBlur, address, result }}/>
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
