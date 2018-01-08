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
          modalTitle={<T id="tickets.purchaseConfirmation" m="Sign Message" />}
          className="stakepool-content-purchase-button"
          disabled={address == "" || message == "" || addressError || messageError}
          onSubmit={onSubmit}
          buttonLabel={<T id="purchaseTickets.purchaseBtn" m="Sign" />}
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
