import { FormattedMessage as T, defineMessages } from "react-intl";
import { InfoModalButton, PassphraseModalButton } from "buttons";
import { TextInput } from "inputs";
import { SignMessageInfoModalContent } from "modals";

const messages = defineMessages({
  addressFieldLabel: {
    id: "securitycenter.sign.form.field.address.label",
    defaultMessage: "Address",
  },
  addressFieldPlaceholder: {
    id: "securitycenter.sign.form.field.address.placeholder",
    defaultMessage: "Enter an address",
  },
  messageFieldLabel: {
    id: "securitycenter.sign.form.field.message.label",
    defaultMessage: "Message",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.sign.form.field.message.placeholder",
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
          onChange={(e) => onChangeAddress(e.target.value)}
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <div className="message-error">
          {addressError && <span className="error">{addressError}</span>}
        </div>
        <TextInput
          label={formatMessage(messages.messageFieldLabel)}
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          placeholder={formatMessage(messages.messageFieldPlaceholder)}
        />
        <div className="message-error">
          {messageError && <span className="error">{messageError}</span>}
        </div>
      </div>
      <div className="message-toolbar">
        <PassphraseModalButton
          modalTitle={<T id="securitycenter.signMessageModal" m="Sign Message" />}
          className="stakepool-content-purchase-button"
          disabled={address == "" || message == "" || addressError || messageError}
          onSubmit={onSubmit}
          loading={isSigningMessage}
          buttonLabel={<T id="securitycenter.signMessageBtn" m="Sign" />}
        />
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
