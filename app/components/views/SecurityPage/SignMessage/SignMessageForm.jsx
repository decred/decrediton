import { FormattedMessage as T, defineMessages } from "react-intl";
import { InfoDocModalButton, PassphraseModalButton } from "buttons";
import { Button } from "pi-ui";
import { TextInput } from "inputs";
import { WatchOnlyWarnNotification } from "shared";
import sharedStyles from "../SecurityPage.module.css";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.signMessage.field.address.placeholder",
    defaultMessage: "Enter an address"
  },
  messageFieldPlaceholder: {
    id: "securitycenter.signMessage.field.message.placeholder",
    defaultMessage: "Enter your message"
  }
});

const SignMessageForm = ({
  address,
  message,
  addressError,
  messageError,
  formatMessage,
  isTrezor,
  isSigningMessage,
  isSignMessageDisabled,
  onSubmit,
  onChangeAddress,
  onChangeMessage
}) => {
  const disabled =
    isSigningMessage ||
    address === "" ||
    message === "" ||
    addressError ||
    messageError ||
    isSignMessageDisabled;
  return (
    <>
      <div className={sharedStyles.securityPageForm}>
        <div className={sharedStyles.buttonRight}>
          <InfoDocModalButton document="SignMessageInfo" draggable />
        </div>
        <div className={sharedStyles.securityPageFormRow}>
          <div className={sharedStyles.securityPageFormRowLabel}>
            <T
              id="securitycenter.signMessage.field.address.label"
              m="Address"
            />
          </div>
          <div className={sharedStyles.securityPageFormRowField}>
            <WatchOnlyWarnNotification isActive={isSignMessageDisabled}>
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
        <div className={sharedStyles.securityPageFormRow}>
          <div className={sharedStyles.securityPageFormRowLabel}>
            <T
              id="securitycenter.signMessage.field.message.label"
              m="Message"
            />
          </div>
          <div className={sharedStyles.securityPageFormRowField}>
            <WatchOnlyWarnNotification isActive={isSignMessageDisabled}>
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
      {isTrezor ? (
        <Button
          kind={disabled ? "disabled" : "primary"}
          loading={isSigningMessage}
          onClick={onSubmit}>
          Sign Message
        </Button>
      ) : (
        <PassphraseModalButton
          modalTitle={
            <T id="securitycenter.signMessageModal" m="Sign Message" />
          }
          buttonLabel={
            <T id="securitycenter.signMessageBtn" m="Sign Message" />
          }
          loading={isSigningMessage}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

SignMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default SignMessageForm;
