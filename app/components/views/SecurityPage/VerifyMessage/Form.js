import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { InfoDocModalButton, KeyBlueButton } from "buttons";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.verify.field.address.placeholder",
    defaultMessage: "Enter an address",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.verify.field.message.placeholder",
    defaultMessage: "Enter your message",
  },
  signatureFieldPlaceholder: {
    id: "securitycenter.verify.field.signature.placeholder",
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
          <InfoDocModalButton document="VerifyMessageInfo" />
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.verify.field.address.label" m="Address"/>
          </div>
          <div className="security-center-form-row-field">
            <TextInput
              required
              value={address}
              invalid={addressError}
              invalidMessage={addressError}
              onChange={e => onChangeAddress(e.target.value)}
              placeholder={formatMessage(messages.addressFieldPlaceholder)}
              showErrors={addressError}
            />
          </div>
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.verify.field.signature.label" m="Signature"/>
          </div>
          <div className="security-center-form-row-field">
            <TextInput
              required
              value={signature}
              invalid={signatureError}
              invalidMessage={signatureError}
              onChange={e => onChangeSignature(e.target.value)}
              placeholder={formatMessage(messages.signatureFieldPlaceholder)}
              showErrors={signatureError}
            />
          </div>
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.verify.field.message.label" m="Message"/>
          </div>
          <div className="security-center-form-row-field-message">
            <TextInput
              required
              value={message}
              invalid={messageError}
              invalidMessage={messageError}
              onChange={e => onChangeMessage(e.target.value)}
              placeholder={formatMessage(messages.messageFieldPlaceholder)}
              showErrors={messageError}
            />
          </div>
        </div>
      </div>
      <KeyBlueButton
        className="stakepool-content-purchase-button"
        disabled={isVerifyingMessage || address == "" || message == "" || signature == "" || addressError || messageError || signatureError}
        onClick={onSubmit}
        loading={isVerifyingMessage}>
        <T id="securitycenter.verify.form.submit" m="Verify Message" />
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
