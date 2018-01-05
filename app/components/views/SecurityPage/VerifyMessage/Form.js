import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { InfoModalButton } from "buttons";
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

const VerifyMessageForm = ({ onSubmit, error, rpcError, formatMessage }) => {
  if (rpcError) {
    error = (
      <div className="error">{rpcError}</div>
    );
  }

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
          classname="address"
          label={formatMessage(messages.addressFieldLabel)}
          name="address"
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <TextInput
          classname="address"
          label={formatMessage(messages.signatureFieldLabel)}
          name="signature"
          placeholder={formatMessage(messages.signatureFieldPlaceholder)}
        />
        <TextInput
          classname="message"
          label={formatMessage(messages.messageFieldLabel)}
          name="message"
          placeholder={formatMessage(messages.messageFieldPlaceholder)}
        />
      </div>
      {error && <div className="error">{error}</div>}
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
