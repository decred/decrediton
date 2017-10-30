import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "../Form/InputField";
import ErrorField from "../Form/ErrorField";
import { validate } from "./validator";
import { Link } from "react-router";

const messages = defineMessages({
  addressFieldLabel: {
    id: "securitycenter.sign.form.field.address.label",
    defaultMessage: "Address",
  },
  addressFieldPlaceholder: {
    id: "securitycenter.sign.form.field.address.placeholder",
    defaultMessage: "Enter your address",
  },
  messageFieldLabel: {
    id: "securitycenter.sign.form.field.message.label",
    defaultMessage: "Message",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.sign.form.field.message.placeholder",
    defaultMessage: "Enter your message",
  },
  passphraseFieldLabel: {
    id: "securitycenter.sign.form.field.passphrase.label",
    defaultMessage: "Passphrase",
  },
  passphraseFieldPlaceholder: {
    id: "securitycenter.sign.form.field.passphrase.placeholder",
    defaultMessage: "Enter your passphrase",
  },
});

const SignMessageForm = ({ handleSubmit, onSubmit, pristine, submitting, error, rpcError, formatMessage }) => {
  if (rpcError) {
    error = (
      <div className="error">{rpcError}</div>
    );
  }

  return (
    <Aux>
      <div className="security-page-toggle">
        <div className="text-toggle">
          <div className="text-toggle-button-left text-toggle-button-active">
            <T id="securitycenter.header.toggle.sign" m="Sign" />
          </div>
          <Link to="/security/verify" className="text-toggle-button-right">
            <T id="securitycenter.header.toggle.verify" m="Verify" />
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="message-content-nest">
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
            label={formatMessage(messages.messageFieldLabel)}
            name="message"
            component={InputField}
            placeholder={formatMessage(messages.messageFieldPlaceholder)}
          />
          <Field
            label={formatMessage(messages.passphraseFieldLabel)}
            name="passphrase"
            component={InputField}
            type="password"
            placeholder={formatMessage(messages.passphraseFieldPlaceholder)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="message-toolbar">
          <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
            <T id="securitycenter.sign.form.submit" m="Sign" />
          </button>
        </div>
      </form>
    </Aux>
  );
};

SignMessageForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string,
  rpcError: PropTypes.string,
};

export default reduxForm({ form: "message/sign", validate })(SignMessageForm);
