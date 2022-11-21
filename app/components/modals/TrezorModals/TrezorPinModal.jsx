import { useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import { PasswordInput } from "inputs";
import { ButtonsToolbar, ExternalLink } from "shared";
import { classNames, Button } from "pi-ui";
import styles from "./TrezorModals.module.css";

const TrezorPinModal = ({
  isGetStarted,
  deviceLabel,
  onSubmitPin,
  onCancelModal
}) => {
  const [currentPin, setCurrentPin] = useState("");

  const onCancelPinModal = useCallback(() => {
    setCurrentPin("");
    onCancelModal();
  }, [onCancelModal]);

  const onSubmit = useCallback(() => {
    onSubmitPin(currentPin);
  }, [onSubmitPin, currentPin]);

  const onClearPin = useCallback(() => {
    setCurrentPin("");
  }, []);

  return (
    <Modal
      className={classNames(styles.pinModal, isGetStarted && styles.getStarted)}
      onCancelModal={onCancelPinModal}>
      <div className={styles.closeButton} onClick={onCancelModal} />
      <h1>
        <T id="trezor.pinModal.title" m="Enter PIN" />
      </h1>
      <p>
        <T
          id="trezor.pinModal.description"
          m="Click button sequence that corresponds to your PIN layout displayed on your Trezor {label}. Not sure how PIN works? {link}"
          values={{
            label: <span className={styles.label}>'{deviceLabel}'</span>,
            link: (
              <ExternalLink
                className={styles.learnMoreLink}
                href="https://wiki.trezor.io/User_manual:Entering_PIN">
                <T id="trezor.pinModal.learnMore" m="Learn More" />
              </ExternalLink>
            )
          }}
        />
      </p>
      <div className={styles.passwordField}>
        <PasswordInput
          newBiggerFontStyle
          hideToggleButton
          id="passwordFieldInput"
          inputClassNames={styles.passwordFieldInput}
          value={currentPin}
          disabled={true}>
          <Button
            aria-label="Clear PIN"
            kind="secondary"
            className={styles.clearPinButton}
            onClick={onClearPin}>
            <div />
          </Button>
        </PasswordInput>
      </div>
      <div className={styles.pinPadContainer}>
        <div className={styles.pinPad}>
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((index) => (
            <div
              key={`trzPadBtn${index}`}
              className={styles.pinPadButton}
              onClick={() => setCurrentPin(currentPin + index)}>
              •
            </div>
          ))}
        </div>
      </div>
      <ButtonsToolbar
        {...{ onCancelModal: onCancelPinModal, onSubmit }}
        className={styles.buttons}
      />
    </Modal>
  );
};

export default TrezorPinModal;
