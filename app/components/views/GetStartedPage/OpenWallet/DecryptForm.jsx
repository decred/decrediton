import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import { Label, Input, FormContainer, Row } from "../helpers";

const messages = defineMessages({
  publicPassphrasePlaceholder: {
    id: "getStarted.decrypt.publicPassphrasePlaceholder",
    defaultMessage: "Public Passphrase"
  }
});

const OpenWalletDecryptFormBodyBase = ({
  publicPassPhrase,
  intl,
  onSetPublicPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  <FormContainer>
    <Row>
      <T
        id="getStarted.decrypt.info"
        m="This wallet is encrypted, please enter the public passphrase to decrypt it."
      />
    </Row>
    <Row>
      <Label>
        <T id="getStarted.decrypt.label" m="Decrypt Wallet" />
      </Label>
      <Input>
        <PasswordInput
          id="publicPassPhraseInput"
          autoFocus
          placeholder={intl.formatMessage(messages.publicPassphrasePlaceholder)}
          value={publicPassPhrase}
          onChange={(e) => onSetPublicPassPhrase(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </Input>
    </Row>
    <div>
      <KeyBlueButton onClick={onOpenWallet} disabled={publicPassPhrase == ""}>
        <T id="decryptWalletForm.openBtn" m="Open Wallet" />
      </KeyBlueButton>
    </div>
  </FormContainer>
);

export default injectIntl(OpenWalletDecryptFormBodyBase);
