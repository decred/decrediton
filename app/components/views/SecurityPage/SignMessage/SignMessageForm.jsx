import { FormattedMessage as T, defineMessages } from "react-intl";
import { InfoDocModalButton, SignMessageButton } from "buttons";
import { TextInput } from "pi-ui";
// import { TextInput } from "inputs";
import styles from "./SignMessageForm.module.css";

import { WatchOnlyWarnNotification } from "shared";

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
  isSigningMessage,
  formatMessage,
  isSignMessageDisabled,
  onChangeAddress,
  onChangeMessage
}) => {
  return (
    <>
      <div className={styles.securityCenterForm}>
        <div className={styles.buttonRight}>
          <InfoDocModalButton document="SignMessageInfo" draggable />
        </div>
        <div className={styles.securityCenterFormRow}>
          <div className={styles.securityCenterFormRowLabel}>
            <T
              id="securitycenter.signMessage.field.address.label"
              m="Address"
            />
          </div>
          <div className={styles.securityCenterFormRowField}>
            <WatchOnlyWarnNotification isActive={isSignMessageDisabled}>
              <TextInput
                id="address"
                required
                value={address}
                onChange={(e) => onChangeAddress(e.target.value)}
                label={formatMessage(messages.addressFieldPlaceholder)}
                error={addressError}
                disabled={isSignMessageDisabled}
              />
            </WatchOnlyWarnNotification>
          </div>
        </div>
        <div className={styles.securityCenterFormRow}>
          <div className={styles.securityCenterFormRowLabel}>
            <T
              id="securitycenter.signMessage.field.message.label"
              m="Message"
            />
          </div>
          <div className={styles.securityCenterFormRowField}>
            <WatchOnlyWarnNotification isActive={isSignMessageDisabled}>
              <TextInput
                id="msg"
                required
                value={message}
                onChange={(e) => onChangeMessage(e.target.value)}
                label={formatMessage(messages.messageFieldPlaceholder)}
                error={messageError}
                disabled={isSignMessageDisabled}
              />
            </WatchOnlyWarnNotification>
          </div>
        </div>
      </div>
      <SignMessageButton
        address={address}
        message={message}
        disabled={
          isSigningMessage ||
          address == "" ||
          message == "" ||
          addressError ||
          messageError ||
          isSignMessageDisabled
        }
      />
    </>
  );
};

SignMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default SignMessageForm;
