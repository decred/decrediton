import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "Form/InputField";
import ErrorField from "Form/ErrorField";
import PurchaseTicketsInfoButton from "PurchaseTicketsInfoButton";
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
   touched, error,
  onShowSignMessageInfo,
  ...props,
  ...state
 }) => {
  const { signMessageSuccess, signMessageError} = props;
  const required = value => value ? undefined : 'Required'
  
  console.log(props);
  

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
          <Field
            name="global"
            component={ErrorField}
          />
        </div>
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
        {error && <div className="error">{error}</div>}
        {signMessageError && <div className="error">{error}</div>}
        <div className="message-toolbar">
          <button className="key-blue-button" type="submit" >
            <T id="securitycenter.sign.form.submit" m="Sign" />
          </button>
        </div>
      </form>
    </Aux>
  );
};

SignMessageForm.propTypes = {
  // handleSubmit: PropTypes.func.isRequired,
  // onSubmit: PropTypes.func.isRequired,
  // pristine: PropTypes.bool.isRequired,
  // submitting: PropTypes.bool.isRequired,
  // formatMessage: PropTypes.func.isRequired,
  // error: PropTypes.string,
  // rpcError: PropTypes.string,
};

export default reduxForm({ form: "message/sign", signMessageValidator })(SignMessage);
