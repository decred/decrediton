import { FormattedMessage as T, defineMessages } from "react-intl";
import { InfoDocModalButton, SignMessageButton } from "buttons";
import { TextInput } from "inputs";
import { WatchOnlyWarnNotification } from "shared";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.signMessage.field.address.placeholder",
    defaultMessage: "Enter an address",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.signMessage.field.message.placeholder",
    defaultMessage: "Enter your message",
  }
});

const SignMessageForm = ({
  onChangeAddress,
  onChangeMessage,
  address,
  message,
  addressError,
  messageError,
  isSigningMessage,
  formatMessage,
  isSignMessageDisabled,
}) => {
  return (
    <Aux>
      <div className="security-center-form">
        <div className="button-right">
          <InfoDocModalButton document="SignMessageInfo" />
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.signMessage.field.address.label" m="Address"/>
          </div>
          <div className="security-center-form-row-field">
            <WatchOnlyWarnNotification isActive={ isSignMessageDisabled }>
              <TextInput
                required
                value={address}
                invalid={addressError}
                invalidMessage={addressError}
                onChange={(e) => onChangeAddress(e.target.value)}
                placeholder={formatMessage(messages.addressFieldPlaceholder)}
                showErrors={addressError}
                disabled={isSignMessageDisabled}
              />
            </WatchOnlyWarnNotification>
          </div>
        </div>
        <div className="security-center-form-row">
          <div className="security-center-form-row-label">
            <T id="securitycenter.signMessage.field.message.label" m="Message"/>
          </div>
          <div className="security-center-form-row-field-message">
            <WatchOnlyWarnNotification isActive={ isSignMessageDisabled }>
              <TextInput
                required
                value={message}
                invalid={messageError}
                invalidMessage={messageError}
                onChange={(e) => onChangeMessage(e.target.value)}
                placeholder={formatMessage(messages.messageFieldPlaceholder)}
                showErrors={messageError}
                disabled={isSignMessageDisabled}
              />
            </WatchOnlyWarnNotification>
          </div>
        </div>
      </div>
      <SignMessageButton
        className="stakepool-content-purchase-button"
        address={address}
        message={message}
        disabled={isSigningMessage || address == "" || message == "" || addressError || messageError || isSignMessageDisabled}
      />
    </Aux>
  );
};

SignMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default SignMessageForm;
