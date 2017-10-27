import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "../Form/InputField";
import TextareaField from "../Form/TextareaField";
import ErrorField from "../Form/ErrorField";
import { validate } from "./validator";
import { Link } from "react-router";

const messages = defineMessages({
  addressFieldLabel: {
    id: "securitycenter.verify.form.field.address.label",
    defaultMessage: "Address:",
  },
  addressFieldPlaceholder: {
    id: "securitycenter.verify.form.field.address.placeholder",
    defaultMessage: "Enter your address here",
  },
  messageFieldLabel: {
    id: "securitycenter.verify.form.field.message.label",
    defaultMessage: "Message:",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.verify.form.field.message.placeholder",
    defaultMessage: "Enter your message here",
  },
  signatureFieldLabel: {
    id: "securitycenter.verify.form.field.signature.label",
    defaultMessage: "Signature:",
  },
  signatureFieldPlaceholder: {
    id: "securitycenter.verify.form.field.signature.placeholder",
    defaultMessage: "Enter your signature here",
  },
});

const VerifyMessageForm = ({ handleSubmit, onSubmit, pristine, submitting, error, rpcError, formatMessage }) => {
  if (rpcError) {
    error = (
      <div className="error">{rpcError}</div>
    );
  }

  return (
    <div>
      <div className="security-page-toggle">
        <div className="text-toggle">
          <Link to="/security/sign" className="text-toggle-button-left">
            <T id="securitycenter.header.toggle.sign" m="Sign" />
          </Link>
          <div className="text-toggle-button-right text-toggle-button-active">
            <T id="securitycenter.header.toggle.verify" m="Verify" />
          </div>
        </div>
      </div>
      <div className="message-content-nest">
        <form onSubmit={handleSubmit(onSubmit)}>
          {error ? <div className="error">{error}</div> : null}
          <Field
            name="global"
            component={ErrorField}
          />
          <Field
            label={formatMessage(messages.addressFieldLabel)}
            name="address"
            component={InputField}
            type="text"
            placeholder={formatMessage(messages.addressFieldPlaceholder)}
          />
          <Field
            label={formatMessage(messages.signatureFieldLabel)}
            name="signature"
            component={InputField}
            type="text"
            placeholder={formatMessage(messages.signatureFieldPlaceholder)}
          />
          <Field
            label={formatMessage(messages.messageFieldLabel)}
            name="message"
            component={TextareaField}
            placeholder={formatMessage(messages.messageFieldPlaceholder)}
          />
          <div className="message-toolbar">
            <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
              <T id="securitycenter.verify.form.submit" m="Verify" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

VerifyMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  rpcError: PropTypes.string,
};

export default reduxForm({ form: "message/verify", validate })(VerifyMessageForm);
