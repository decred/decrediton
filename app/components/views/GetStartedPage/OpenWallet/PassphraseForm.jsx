import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import { Label, Input, FormContainer, Row, ButtonsBar } from "../helpers";

const messages = defineMessages({
  privatePassphrasePlaceholder: {
    id: "getStarted.decrypt.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const PassphraseFormBase = ({
  passPhrase,
  intl,
  onSetPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  <FormContainer>
    <Row>
      <T
        id="getStarted.passphrase.info"
        m="The accounts for this wallet haven't been discovered yet. Please enter the wallet's private passphrase to perform account discovery."
      />
    </Row>
    <Row>
      <Label>
        <T id="getStarted.discoverAccounts.passphrase" m="Private Passphrase" />
      </Label>
      <Input>
        <PasswordInput
          id="privatePassphraseInput"
          autoFocus
          placeholder={intl.formatMessage(
            messages.privatePassphrasePlaceholder
          )}
          value={passPhrase}
          onChange={(e) => onSetPassPhrase(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </Input>
    </Row>
    <ButtonsBar>
      <KeyBlueButton onClick={onOpenWallet} disabled={passPhrase == ""}>
        <T id="passphraseForm.continueBtn" m="Continue" />
      </KeyBlueButton>
    </ButtonsBar>
  </FormContainer>
);

export default injectIntl(PassphraseFormBase);
