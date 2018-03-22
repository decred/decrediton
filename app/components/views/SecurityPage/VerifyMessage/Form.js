import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { InfoModalButton, KeyBlueButton } from "buttons";
import { VerifyMessageInfoModalContent } from "modals";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.form.field.address.placeholder",
    defaultMessage: "Enter an address",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.form.field.message.placeholder",
    defaultMessage: "Enter your message",
  },
  signatureFieldPlaceholder: {
    id: "securitycenter.form.field.signature.placeholder",
    defaultMessage: "Enter your signature",
  },
});

const VerifyMessageForm = ({
  onSubmit,
  onChangeAddress,
  onChangeMessage,
  onChangeSignature,
  address,
  message,
  signature,
  addressError,
  messageError,
  signatureError,
  isVerifyingMessage,
  formatMessage
}) => {
  return (
    <Aux>
      <div className="security-center-form">
        <div className="button-right">
          <InfoModalButton
            modalTitle={<h1><T id="securitycenter.verifyInfo" m="Verify Message Information"/></h1>}
            modalContent={<VerifyMessageInfoModalContent />}
          />
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.form.field.address.label" m="Address"/>:
          </div>
          <div className="security-center-form-row-field">
            <TextInput
              value={address}
              onChange={e => onChangeAddress(e.target.value)}
              placeholder={formatMessage(messages.addressFieldPlaceholder)}
            />
            <div className="message-error">
              {addressError && <span className="error">{addressError}</span>}
            </div>
          </div>
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.form.field.message.label" m="Message"/>:
          </div>
          <div className="security-center-form-row-field">
            <TextInput
              value={message}
              onChange={e => onChangeMessage(e.target.value)}
              placeholder={formatMessage(messages.messageFieldPlaceholder)}
            />
            <div className="message-error">
              {messageError && <span className="error">{messageError}</span>}
            </div>
          </div>
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.form.field.signature.label" m="Signature"/>:
          </div>
          <div className="security-center-form-row-field">
            <TextInput
              value={signature}
              onChange={e => onChangeSignature(e.target.value)}
              placeholder={formatMessage(messages.signatureFieldPlaceholder)}
            />
            <div className="message-error">
              {signatureError && <span className="error">{signatureError}</span>}
            </div>
          </div>
        </div>
      </div>
      <KeyBlueButton
        className="stakepool-content-purchase-button"
        disabled={isVerifyingMessage || address == "" || message == "" || signature == "" || addressError || messageError || signatureError}
        onClick={onSubmit}
        loading={isVerifyingMessage}>
        <T id="securitycenter.verify.form.submit" m="Verify" />
      </KeyBlueButton>
    </Aux>
  );
};

VerifyMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default VerifyMessageForm;
