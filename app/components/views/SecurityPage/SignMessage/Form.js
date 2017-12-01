import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "Form/InputField";
import ErrorField from "Form/ErrorField";
import InfoModalButton from "InfoModalButton";
import { SignMessageInfoModalContent } from "modals";
import { validate } from "./validator";

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

const SignMessageForm = ({ handleSubmit, onSubmit, pristine, error, submitting, rpcError, formatMessage }) => {
  if (rpcError) {
    error = (
      <div className="error">{rpcError}</div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="message-content-nest">
        <div className="button-right">
          <InfoModalButton
            modalTitle={<h1><T id="securitycenter.signInfo" m="Sign Message Information"/></h1>}
            modalContent={<SignMessageInfoModalContent />}
          />
        </div>
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
        <Field
          name="global"
          component={ErrorField}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="message-toolbar">
        <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </div>
    </form>
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
