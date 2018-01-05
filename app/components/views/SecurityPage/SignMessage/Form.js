import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "Form/InputField";
import ErrorField from "Form/ErrorField";
import { InfoModalButton } from "buttons";
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

const SignMessageForm = ({
  onSubmit,
  onChangeAddress,
  onChangeMessage,
  address,
  message,
  addressError,
  messageError,
   formatMessage
   }) => {
  return (
    <Aux>
      <div className="message-content-nest">
        <div className="button-right">
          <InfoModalButton
            modalTitle={<h1><T id="securitycenter.signInfo" m="Sign Message Information"/></h1>}
            modalContent={<SignMessageInfoModalContent />}
          />
        </div>
        <TextInput
          label={formatMessage(messages.addressFieldLabel)}
          value={address}
          onChange={onChangeAddress}
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <div className="message-error">
          {addressError && <span className="error">{addressError}</span>}
        </div>
        <TextInput
          label={formatMessage(messages.messageFieldLabel)}
          value={message}
          onChange={onChangeMessage}
          placeholder={formatMessage(messages.messageFieldPlaceholder)}
        />
        <div className="message-error">
          {messageError && <span className="error">{messageError}</span>}
        </div>
      </div>
      <div className="message-toolbar">
        <button className="key-blue-button" onClick={onSubmit}>
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </div>
    </Aux>
  );
};

SignMessageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default SignMessageForm;
