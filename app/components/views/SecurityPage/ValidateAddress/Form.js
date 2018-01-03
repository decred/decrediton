import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput } from "inputs";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.validate.form.field.address.placeholder",
    defaultMessage: "Enter your address",
  },
});

const ValidateAddressForm = ({
  onAddressChange,
  result,
  address,
  intl
}) => (
    <Aux>
      <div className="validate-address-form-area">
        <div className="validate-address-form-label">
          <T id="securitycenter.validate.form.field.address.label" m="Address" />
        </div>
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
