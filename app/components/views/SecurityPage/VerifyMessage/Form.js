import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "Form/InputField";
import ErrorField from "Form/ErrorField";
import InfoModalButton from "InfoModalButton";
import { VerifyMessageInfoModalContent } from "modals";
import { validate } from "./validator";

const messages = defineMessages({
  addressFieldLabel: {
    id: "securitycenter.verify.form.field.address.label",
    defaultMessage: "Address",
  },
  addressFieldPlaceholder: {
    id: "securitycenter.verify.form.field.address.placeholder",
    defaultMessage: "Enter your address",
  },
  messageFieldLabel: {
    id: "securitycenter.verify.form.field.message.label",
    defaultMessage: "Message",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.verify.form.field.message.placeholder",
    defaultMessage: "Enter your message",
  },
  signatureFieldLabel: {
    id: "securitycenter.verify.form.field.signature.label",
    defaultMessage: "Signature",
  },
  signatureFieldPlaceholder: {
    id: "securitycenter.verify.form.field.signature.placeholder",
    defaultMessage: "Enter your signature",
  },
});

const VerifyMessageForm = ({ handleSubmit, onSubmit, pristine, submitting, error, rpcError, formatMessage }) => {
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
            modalTitle={<h1><T id="securitycenter.verifyInfo" m="Verify Message Information"/></h1>}
            modalContent={<VerifyMessageInfoModalContent />}
          />
        </div>
        <Field
          classname="address"
          label={formatMessage(messages.addressFieldLabel)}
          name="address"
          component={InputField}
          type="text"
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <Field
          classname="address"
          label={formatMessage(messages.signatureFieldLabel)}
          name="signature"
          component={InputField}
          type="text"
          placeholder={formatMessage(messages.signatureFieldPlaceholder)}
        />
        <Field
          classname="message"
          label={formatMessage(messages.messageFieldLabel)}
          name="message"
          component={InputField}
          placeholder={formatMessage(messages.messageFieldPlaceholder)}
        />
        <Field
          name="global"
          component={ErrorField}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="message-toolbar">
        <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
          <T id="securitycenter.verify.form.submit" m="Verify" />
        </button>
      </div>
    </form>
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
