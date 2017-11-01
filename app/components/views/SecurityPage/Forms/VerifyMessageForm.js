import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "../Form/InputField";
import ErrorField from "../Form/ErrorField";
import PurchaseTicketsInfoButton from "PurchaseTicketsInfoButton";
import { validate } from "./validator";
import { Link } from "react-router";

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

const VerifyMessageForm = ({  }) => {

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="message-content-nest">
          <div className="button-right">
            <PurchaseTicketsInfoButton onClick={onShowVerifyMessageInfo} tooltipText={<T id="securitycenter.signInfo" m="Verify Message Information"/>}/>
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
