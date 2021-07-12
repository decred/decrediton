import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { PassphraseModal } from "modals";

const messages = defineMessages({
  labelText: {
    id: "addAccountModal.label",
    defaultMessage: "New Account Name"
  },
  placeholderText: {
    id: "addAccountModal.placeholder",
    defaultMessage: "Write the new Account Name"
  }
});

const Modal = ({ name, hasFailedAttempt, setName, intl, ...props }) => (
  <PassphraseModal {...props}>
    <TextInput
      newBiggerFontStyle
      label={<T id="addAccountModal.newAccountName" m="New Account Name" />}
      autoFocus
      required
      showErrors={hasFailedAttempt}
      id="name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      label={intl.formatMessage(messages.labelText)}
      placeholder={intl.formatMessage(messages.placeholderText)}
    />
  </PassphraseModal>
);

export default Modal;
