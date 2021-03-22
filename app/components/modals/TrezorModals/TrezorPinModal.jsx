import { useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import { PasswordInput } from "inputs";
import { ButtonsToolbar } from "shared";
import { InvisibleButton } from "buttons";
import { classNames } from "pi-ui";
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
      <h1>
        <T id="trezor.pinModal.title" m="Enter Pin" />
      </h1>
      <p>
        <T
          id="trezor.pinModal.description"
          m="Click button sequence that corresponds to your pin on trezor {label}"
          values={{
            label: <span className={styles.label}>'{deviceLabel}'</span>
          }}
        />
      </p>
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
        <div>
          <InvisibleButton onClick={onClearPin}>
            <T id="trezor.pinModal.clear" m="clear" />
          </InvisibleButton>
        </div>
      </div>
      <div className={styles.passwordField}>
        <PasswordInput value={currentPin} disabled={true} />
      </div>
      <ButtonsToolbar
        {...{ onCancelModal: onCancelPinModal, onSubmit }}
        className={styles.buttons}
      />
    </Modal>
  );
};

export default TrezorPinModal;
