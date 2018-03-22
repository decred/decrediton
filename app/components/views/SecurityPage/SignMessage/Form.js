import { FormattedMessage as T, defineMessages } from "react-intl";
import { InfoModalButton, PassphraseModalButton } from "buttons";
import { TextInput } from "inputs";
import { SignMessageInfoModalContent } from "modals";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.form.field.address.placeholder",
    defaultMessage: "Enter an address",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.form.field.message.placeholder",
    defaultMessage: "Enter your message",
  }
});

const SignMessageForm = ({
  onSubmit,
  onChangeAddress,
  onChangeMessage,
  address,
  message,
  addressError,
  messageError,
  isSigningMessage,
  formatMessage
}) => {
  return (
    <Aux>
      <div className="security-center-form">
        <div className="button-right">
          <InfoModalButton
            modalTitle={<h1><T id="securitycenter.signInfo" m="Sign Message Information"/></h1>}
            modalContent={<SignMessageInfoModalContent />}
          />
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.form.field.address.label" m="Address"/>:
          </div>
          <div className="security-center-form-row-field">
            <TextInput
              value={address}
              onChange={(e) => onChangeAddress(e.target.value)}
              placeholder={formatMessage(messages.addressFieldPlaceholder)}
            />
            <div className="message-error">
              {addressError && <span className="error">*{addressError}</span>}
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
              onChange={(e) => onChangeMessage(e.target.value)}
              placeholder={formatMessage(messages.messageFieldPlaceholder)}
            />
            <div className="message-error">
              {messageError && <span className="error">*{messageError}</span>}
            </div>
          </div>
        </div>
      </div>
      <PassphraseModalButton
        modalTitle={<T id="securitycenter.signMessageModal" m="Sign Message" />}
        className="stakepool-content-purchase-button"
        disabled={isSigningMessage || address == "" || message == "" || addressError || messageError}
        onSubmit={onSubmit}
        loading={isSigningMessage}
        buttonLabel={<T id="securitycenter.signMessageBtn" m="Sign" />}
      />
    </Aux>
  );
};

SignMessageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default SignMessageForm;
