import { FormattedMessage as T, injectIntl } from "react-intl";
import ValidateAddressForm from "./Form";
import { validateAddressPage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class ValidateAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.validateAddressSuccess != nextProps.validateAddressSuccess) {
      this.setState({validateAddressSuccess: nextProps.validateAddressSuccess});
    }
    if (this.props.validateAddressError!= nextProps.validateAddressError) {
      this.setState({validateAddressError: nextProps.validateAddressError});
    }
  }

  getInitialState() {
    return {
      validateAddressSuccess: null,
      validateAddressError: null,
    };
  }

  componentWillUnmount() {
    console.log(this.state);
    this.setState(this.getInitialState());
    console.log(this.state);
  }

  render() {
    const { validateAddressError, validateAddressSuccess } = this.state;

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
    }

    return (
      <div className="tab-card message message-verify">
        <ValidateAddressForm onSubmit={this.onSubmit} rpcError={validateAddressError} formatMessage={this.props.intl.formatMessage} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    console.log(props);
    this.props.validateAddress(props.address);
  }
}

ValidateAddress.propTypes = {
  intl: PropTypes.object.isRequired,
  validateAddressError: PropTypes.string,
  validateAddressSuccess: PropTypes.object,
};

export default validateAddressPage(injectIntl(ValidateAddress));
