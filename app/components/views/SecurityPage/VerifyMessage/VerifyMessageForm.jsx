import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { Button } from "pi-ui";
import { InfoDocModalButton } from "buttons";
import sharedStyles from "../SecurityPage.module.css";
import styles from "./VerifyMessageForm.module.css";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.verify.field.address.placeholder",
    defaultMessage: "Enter an address"
  },
  messageFieldPlaceholder: {
    id: "securitycenter.verify.field.message.placeholder",
    defaultMessage: "Enter your message"
  },
  signatureFieldPlaceholder: {
    id: "securitycenter.verify.field.signature.placeholder",
    defaultMessage: "Enter your signature"
  }
});

const VerifyMessageForm = ({
  onSubmit,
  onChangeAddress,
  onChangeMessage,
  onChangeSignature,
  address,
  message,
  signature,
  addressError,
  messageError,
  signatureError,
  isVerifyingMessage,
  formatMessage,
  verifyMessageSuccess
}) => {
  const disabled = isVerifyingMessage
    || address === ""
    || message === ""
    || signature === ""
    || addressError
    || messageError
    || signatureError;
  const isValid = verifyMessageSuccess && verifyMessageSuccess.valid;
  return (
    <>
      <div className={sharedStyles.securityPageForm}>
        <div className={sharedStyles.buttonRight}>
          <InfoDocModalButton document="VerifyMessageInfo" />
        </div>
        <div className={sharedStyles.securityPageFormRow}>
          <div className={sharedStyles.securityPageFormRowLabel}>
            <T id="securitycenter.verify.field.address.label" m="Address" />
          </div>
          <div className={sharedStyles.securityPageFormRowField}>
            <TextInput
              required
              value={address}
              invalid={addressError}
              invalidMessage={addressError}
              showErrors={addressError}
              placeholder={formatMessage(messages.addressFieldPlaceholder)}
              onChange={(e) => onChangeAddress(e.target.value)}
            />
          </div>
        </div>
        <div className={sharedStyles.securityPageFormRow}>
          <div className={sharedStyles.securityPageFormRowLabel}>
            <T id="securitycenter.verify.field.signature.label" m="Signature" />
          </div>
          <div className={sharedStyles.securityPageFormRowField}>
            <TextInput
              required
              value={signature}
              invalid={signatureError}
              invalidMessage={signatureError}
              successMessage={"Valid Signature"}
              showErrors={signatureError}
              showSuccess={isValid && !disabled}
              placeholder={formatMessage(messages.signatureFieldPlaceholder)}
              onChange={(e) => onChangeSignature(e.target.value)}
            />
          </div>
        </div>
        <div className={sharedStyles.securityPageFormRow}>
          <div className={sharedStyles.securityPageFormRowLabel}>
            <T id="securitycenter.verify.field.message.label" m="Message" />
          </div>
          <div className={sharedStyles.securityPageFormRowFieldMessage}>
            <TextInput
              required
              value={message}
              invalid={messageError}
              invalidMessage={messageError}
              showErrors={messageError}
              placeholder={formatMessage(messages.messageFieldPlaceholder)}
              onChange={(e) => onChangeMessage(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button
        className={styles.button}
        kind={disabled ? "disabled" : "primary"}
        loading={isVerifyingMessage}
        onClick={onSubmit}>
        Verify Message
      </Button>
    </>
  );
};

VerifyMessageForm.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default VerifyMessageForm;
