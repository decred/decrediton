import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "modals";
import { useMountEffect } from "hooks";

const messages = defineMessages({
  mixedAccountName: {
    id: "addMixerAccountModal.mixedAccountName.placeholder",
    defaultMessage: "Enter the mixed account name"
  },
  changeAccountName: {
    id: "addMixerAccountModal.changeAccountName.placeholder",
    defaultMessage: "Enter the unmixed account name"
  }
});

const AddMixerAccountsModal = ({
  mixedAccountName,
  changeAccountName,
  setMixedAccountName,
  setChangeAccountName,
  show,
  intl,
  ...props
}) => {
  useMountEffect(() => {
    setMixedAccountName("");
    setChangeAccountName("");
  });

  return (
    <PassphraseModal {...{ show, ...props }}>
      <PassphraseModalField
        label={
          <T
            id="addMixerAccountModal.mixedAccountName"
            m="Mixed Account Name"
          />
        }>
        <TextInput
          id="mixedAccountNameInput"
          autoFocus
          required
          id="name"
          type="text"
          placeholder={intl.formatMessage(messages.mixedAccountName)}
          value={mixedAccountName}
          onChange={(e) => setMixedAccountName(e.target.value)}
        />
      </PassphraseModalField>
      <PassphraseModalField
        label={
          <T
            id="addMixerAccountModal.changeAccountName"
            m="Unmixed Account Name"
          />
        }>
        <TextInput
          id="changeAccountName"
          autoFocus
          required
          id="name"
          type="text"
          placeholder={intl.formatMessage(messages.changeAccountName)}
          value={changeAccountName}
          onChange={(e) => setChangeAccountName(e.target.value)}
        />
      </PassphraseModalField>
    </PassphraseModal>
  );
};

export default injectIntl(AddMixerAccountsModal);
