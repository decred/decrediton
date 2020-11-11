import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "modals";
import { useMountEffect } from "hooks";

const messages = defineMessages({
  mixedAccountName: {
    id: "addMixerAccountModal.mixedAccountName",
    defaultMessage: "Mixed Account Name"
  },
  changeAccountName: {
    id: "addMixerAccountModal.changeAccountName",
    defaultMessage: "Unmixed Account Name"
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
