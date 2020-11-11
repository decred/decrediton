import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import { ButtonsToolbar } from "shared";
import { InvisibleButton } from "buttons";
import { useState, useMemo } from "react";
import styles from "./trezor.module.css";
import { classNames } from "pi-ui";
import { PIN_LABELS } from "constants/trezor";

const PinButton = ({ index, label, onClick }) => (
  <div className={styles.pinPadButton} onClick={() => onClick(index)}>
    {label}
  </div>
);

const PinModal = ({ isGetStarted, device, deviceLabel, onCancelModal }) => {
  const [currentPin, setCurrentPin] = useState("");

  const onPinButtonClick = (index) => {
    setCurrentPin(currentPin + index);
  };

  const onCancelPinModal = () => {
    setCurrentPin("");
    onCancelModal();
  };

  const onSubmit = () => {
    submitPin(currentPin);
  };

  const onClearPin = () => {
    setCurrentPin("");
  };

  const onChangeCurrentPin = (e) => {
    const txt = (e.target.value || "").toUpperCase().trim();
    let pin = "";
    for (let i = 0; i < txt.length; i++) {
      const idx = PIN_LABELS.indexOf(txt[i]);
      if (idx > -1) pin = pin + "" + (idx + 1);
    }
    setCurrentPin(pin);
  };

  const currentPinMemo = useMemo(
    () =>
      currentPin
        .split("")
        .map((v) => PIN_LABELS[parseInt(v) - 1])
        .join(""),
    [currentPin]
  );

  const Button = ({ index }) => (
    <PinButton
      label={PIN_LABELS[index - 1]}
      index={index}
      onClick={onPinButtonClick}
    />
  );

  const trezorLabel = device ? deviceLabel : "";

  const className = classNames(
    "passphrase-modal",
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
        <Button index={7} />
        <Button index={8} />
        <Button index={9} />
        <Button index={4} />
        <Button index={5} />
        <Button index={6} />
        <Button index={1} />
        <Button index={2} />
        <Button index={3} />
      </div>
      <div>
        <InvisibleButton onClick={onClearPin} className="pin-pad-clear-btn">
          <T id="trezor.pinModal.clear" m="clear" />
        </InvisibleButton>
      </div>
      <div className="password-field">
        <PasswordInput value={currentPinMemo} onChange={onChangeCurrentPin} />
      </div>
      <ButtonsToolbar {...{ onCancelModal: onCancelPinModal, onSubmit }} />
    </Modal>
  );
};

export default PinModal;
