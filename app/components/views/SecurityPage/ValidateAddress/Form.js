import { injectIntl, defineMessages } from "react-intl";
import { TextInput } from "inputs";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.validate.form.field.address.placeholder",
    defaultMessage: "Enter an address to validate",
  },
});

const ValidateAddressForm = ({
  onAddressChange,
  result,
  address,
  intl
}) => (
  <Aux>
    <div className="security-center-form">
      <div className="validate-address-form-address">
        <TextInput
          value={address}
          placeholder={intl.formatMessage(messages.addressFieldPlaceholder)}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
    </div>
    <div className="validate-address-response-area">
      {result &&
          <div className="validate-address-response-area-result">
            {result}
          </div>
      }
    </div>
  </Aux>
);

export default injectIntl(ValidateAddressForm);
