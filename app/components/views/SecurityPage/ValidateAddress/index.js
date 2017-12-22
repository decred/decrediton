import { FormattedMessage as T, injectIntl } from "react-intl";
import ValidateAddressForm from "./Form";
import { validateAddressPage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class ValidateAddress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { validateAddressError, validateAddressSuccess } = this.props;

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
