import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { InfoModalButton, KeyBlueButton } from "buttons";
import { VerifyMessageInfoModalContent } from "modals";

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

const VerifyMessageForm = ({
  onSubmit, onChangeAddress, onChangeMessage, onChangeSignature, address, message, signature, addressError, messageError, signatureError, formatMessage }) => {
  return (
    <Aux>
      <div className="message-content-nest">
        <div className="button-right">
          <InfoModalButton
            modalTitle={<h1><T id="securitycenter.verifyInfo" m="Verify Message Information"/></h1>}
            modalContent={<VerifyMessageInfoModalContent />}
          />
        </div>
        <TextInput
          label={formatMessage(messages.addressFieldLabel)}
          value={address}
          onChange={e => onChangeAddress(e.target.value)}
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <div className="message-error">
          {addressError && <span className="error">{addressError}</span>}
        </div>
        <TextInput
          label={formatMessage(messages.signatureFieldLabel)}
          value={signature}
          onChange={e => onChangeSignature(e.target.value)}
          placeholder={formatMessage(messages.signatureFieldPlaceholder)}
        />
        <div className="message-error">
          {messageError && <span className="error">{messageError}</span>}
        </div>
        <TextInput
          label={formatMessage(messages.messageFieldLabel)}
          value={message}
          onChange={e => onChangeMessage(e.target.value)}
          placeholder={formatMessage(messages.messageFieldPlaceholder)}
        />
        <div className="message-error">
          {signatureError && <span className="error">{signatureError}</span>}
        </div>
      </div>
      <div className="message-toolbar">
        <KeyBlueButton onClick={onSubmit}>
          <T id="securitycenter.verify.form.submit" m="Verify" />
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

VerifyMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default VerifyMessageForm;
