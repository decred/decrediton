import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "Form/InputField";
import PurchaseTicketsInfoButton from "PurchaseTicketsInfoButton";
import { CopyToClipboard } from "shared";
import {signMessageValidator} from "../validator"

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

const SignMessage = ({
  onSubmitSignMessage,
  formatMessage,
  handleSubmit,
  submitting,
  pristine,
  valid,
  signMessageSuccess,
  signMessageError,
  onShowSignMessageInfo,
  ...props,
 }) => {
  return (
    <Aux>
      <form onSubmit={ handleSubmit(onSubmitSignMessage) }>
        <div className="message-content-nest">
          <div className="button-right">
            <PurchaseTicketsInfoButton onClick={onShowSignMessageInfo} tooltipText={<T id="securitycenter.signInfo" m="Sign Message Information" />} />
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
        </div>
        <div className="message-toolbar">
          <button className="key-blue-button" type="submit" disabled={pristine || submitting || !valid}>
            <T id="securitycenter.sign.form.submit" m="Sign" />
          </button>
        </div>
      </form>
      {
          signMessageSuccess &&
            (<div className="message-nest">
              <div className="message-content">
                <div>
                  {signMessageSuccess.signature}
                </div>
                <CopyToClipboard textToCopy={signMessageSuccess.signature} className="message-content-nest-copy-to-clipboard-icon" />
              </div>
            </div>)
        }
        {
          signMessageError &&
            (<div className="sign-message-error">
              {formatMessage({id:"securitycenter.sign.form.error",defaultMessage:signMessageError})}
            </div>)
        }
    </Aux>
  );
};

SignMessage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmitSignMessage: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  formatMessage: PropTypes.func.isRequired,
  onShowSignMessageInfo: PropTypes.func.isRequired,
  signMessageError: PropTypes.string,
  signMessageSuccess: PropTypes.object,
};

export default reduxForm({ form: "message/sign", validate: signMessageValidator })(SignMessage);
