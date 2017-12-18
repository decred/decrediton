import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "Form/InputField";
import ErrorField from "Form/ErrorField";
import { validate } from "./validator";

const messages = defineMessages({
  addressFieldLabel: {
    id: "securitycenter.validate.form.field.address.label",
    defaultMessage: "Address",
  },
  addressFieldPlaceholder: {
    id: "securitycenter.validate.form.field.address.placeholder",
    defaultMessage: "Enter your address",
  },
});

const ValidateAddressForm = ({ handleSubmit, onSubmit, pristine, submitting, error, rpcError, formatMessage }) => {
  if (rpcError) {
    error = (
      <div className="error">{rpcError}</div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="message-content-nest">
        <Field
          classname="address"
          label={formatMessage(messages.addressFieldLabel)}
          name="address"
          component={InputField}
          type="text"
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <Field
          name="global"
          component={ErrorField}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="message-toolbar">
        <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
          <T id="securitycenter.validate.form.submit" m="Validate" />
        </button>
      </div>
    </form>
  );
};

ValidateAddressForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  rpcError: PropTypes.string,
};

export default reduxForm({ form: "message/validate", validate })(ValidateAddressForm);
