import { injectIntl, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { PassphraseModal } from "modals";
import { useMountEffect } from "hooks";

const messages = defineMessages({
  mixedAccountNameLabel: {
    id: "addMixerAccountModal.mixedAccountName",
    defaultMessage: "Mixed Account Name"
  },
  mixedAccountName: {
    id: "addMixerAccountModal.mixedAccountName.placeholder",
    defaultMessage: "Enter the mixed account name"
  },
  changeAccountNameLabel: {
    id: "addMixerAccountModal.changeAccountName",
    defaultMessage: "Unmixed Account Name"
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
      <TextInput
        newBiggerFontStyle
        id="mixedAccountNameInput"
        autoFocus
        required
        id="mixedAccountName"
        type="text"
        label={intl.formatMessage(messages.mixedAccountNameLabel)}
        placeholder={intl.formatMessage(messages.mixedAccountName)}
        value={mixedAccountName}
        onChange={(e) => setMixedAccountName(e.target.value)}
      />
      <TextInput
        newBiggerFontStyle
        id="changeAccountName"
        autoFocus
        required
        id="unmixedAccountName"
        type="text"
        label={intl.formatMessage(messages.changeAccountNameLabel)}
        placeholder={intl.formatMessage(messages.changeAccountName)}
        value={changeAccountName}
        onChange={(e) => setChangeAccountName(e.target.value)}
      />
    </PassphraseModal>
  );
};

export default injectIntl(AddMixerAccountsModal);
