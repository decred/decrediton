import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import "style/GetStarted.less";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "getStarted.discoverAddresses.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const DiscoverAddressesFormBodyBase = ({
  passPhrase,
  isInputRequest,
  intl,
  onSetPassPhrase,
  onDiscoverAddresses,
  onKeyDown
}) => (
  isInputRequest ? (
    <Aux>
      <div className="advanced-page-form">
        <div className="advanced-daemon-row">
          <T id="getStarted.discoverAccountsInfo" m={`
            Enter the passphrase you just created to scan the blockchain for additional accounts you may have previously created with your wallet.

            Your account names aren't stored on the blockchain, so you will have to rename them after setting up Decrediton.
          `}/>
        </div>
        <div className="advanced-daemon-row">
          <div className="advanced-daemon-label">
            <T id="getStarted.discover.label" m="Scan for accounts" />
          </div>
          <div className="advanced-daemon-input">
            <PasswordInput
              autoFocus
              className="get-started-input-private-password"
              placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
              value={passPhrase}
              onChange={(e) => onSetPassPhrase(e.target.value)}
              onKeyDown={onKeyDown}/>
          </div>
        </div>
        <div className="loader-bar-buttons">
          <KeyBlueButton onClick={onDiscoverAddresses}>
            <T id="getStarted.discoverAddresses.scanBtn" m="Scan" />
          </KeyBlueButton>
        </div>
      </div>
    </Aux>
  ) : null
);
const DiscoverAddressesFormBody = injectIntl(DiscoverAddressesFormBodyBase);

export { DiscoverAddressesFormBody };
