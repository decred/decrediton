import { FormattedMessage as T } from "react-intl";
import { TextInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "../PassphraseModal";

const Modal = ({
  name,
  hasFailedAttempt,
  setName,
  ...props
}) => (
  <PassphraseModal {...{ ...props }} >
    <PassphraseModalField
      label={<T id="addAccountModal.newAccountName" m="New Account Name" />}
    >
      <TextInput
        autoFocus
        required
        requiredMessage={<T id="addAccountModal.errors.noAccountName" m="*Please enter your new account name" />}
        showErrors={hasFailedAttempt}
        id="name"
        type="text"
        placeholder=""
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </PassphraseModalField>
  </PassphraseModal>
);

export default Modal;
