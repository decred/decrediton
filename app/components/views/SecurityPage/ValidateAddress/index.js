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

  componentWillUnmount() {
    this.props.validateAddressCleanStore();
  }

  render() {
    const { validateAddressSuccess } = this.props;
    const { address, error } = this.state;
    const { onAddressChange, onAddressBlur } = this;

    let invalidAddress = ( error &&
      <div className="message-nest">
        <div className="message-content invalid">
          <T id="securitycenter.validate.result.invalid" m="Invalid address!" />
          {error}
        </div>
      </div>);

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
        result = (
          <div className="message-nest">
            <div className="message-content valid">
              {isValidDisplay}
            </div>
          </div>
        );
      } else {
        result = invalidAddress;
      }
    } else {
      result = invalidAddress;
    }

    return (
      <div className="tab-card message message-verify">
        <ValidateAddressForm {...{onAddressChange, onAddressBlur, address, result}}/>
      </div>
    );
  }

  onAddressChange(address) {
    if (address == "") {
      this.setState({address: "", error: <T id="securitycenter.validate.form.error" m="Please enter an address"/>});
      return;
    }
    console.log("validate address:", address);
    this.props.validateAddress(address)
      .then(resp => {
        if (!resp.getIsValid()) {
          console.log("here", resp);
          this.setState({address, error: resp.error});
        }
        else {
          console.log("there", resp);
          this.setState({address, error: null});
        }
      })
      .catch(error => {
        console.log("erere");
        this.setState({address, error});
      });
  }
}

export default validateAddressPage(ValidateAddress);
