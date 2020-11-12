import { useState, useMemo, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import { PasswordInput } from "inputs";
import { ButtonsToolbar } from "shared";
import { InvisibleButton } from "buttons";
import { PIN_LABELS } from "constants/trezor";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const PinButton = ({ index, label, onClick }) => (
  <div className={styles.pinPadButton} onClick={() => onClick(index)}>
    {label}
  </div>
);

const TrezorPinModal = ({
  isGetStarted,
  device,
  deviceLabel,
  onSubmitPin,
  onCancelModal
}) => {
  const [currentPin, setCurrentPin] = useState("");

  const onPinButtonClick = useCallback(
    (index) => {
      setCurrentPin(currentPin + index);
    },
    [currentPin]
  );

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

  const onChangeCurrentPin = useCallback((e) => {
    const txt = (e.target.value || "").toUpperCase().trim();
    let pin = "";
    for (let i = 0; i < txt.length; i++) {
      const idx = PIN_LABELS.indexOf(txt[i]);
      if (idx > -1) pin = pin + "" + (idx + 1);
    }
    setCurrentPin(pin);
  }, []);

  const currentPinMemo = useMemo(
    () =>
      currentPin
        .split("")
        .map((v) => PIN_LABELS[parseInt(v) - 1])
        .join(""),
    [currentPin]
  );

  const trezorLabel = device ? deviceLabel : "";

  const className = classNames(
    styles.trezorPinModal,
    isGetStarted && styles.getStarted
  );

  return (
    <Modal {...{ className, onCancelModal: onCancelPinModal }}>
      <h1>
        <T id="trezor.pinModal.title" m="Enter Pin" />
      </h1>
      <p>
        <T
          id="trezor.pinModal.description"
          m="Click button sequence that corresponds to your pin on trezor {label}"
          values={{
            label: <span className={styles.trezorLabel}>'{trezorLabel}'</span>
          }}
        />
      </p>
      <div className={styles.pinPad}>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((index) => (
          <PinButton index={index} onClick={onPinButtonClick} />
        ))}
      </div>
      <div>
        <InvisibleButton onClick={onClearPin}>
          <T id="trezor.pinModal.clear" m="clear" />
        </InvisibleButton>
      </div>
      <div className={styles.passwordField}>
        <PasswordInput value={currentPinMemo} onChange={onChangeCurrentPin} />
      </div>
      <ButtonsToolbar {...{ onCancelModal: onCancelPinModal, onSubmit }} />
    </Modal>
  );
};

export default TrezorPinModal;
