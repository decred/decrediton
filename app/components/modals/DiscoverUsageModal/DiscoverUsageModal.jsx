import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./DiscoverUsageModal.module.css";
import { NumericInput } from "inputs";
import { useEffect, useState, useCallback } from "react";
import { PiUiButton, InvisiblePiUiButton } from "buttons";

const DiscoverUsageModal = ({
  onCancelModal,
  onSubmit,
  modalContent,
  modalTitle
}) => {
  const [gapLimit, setGapLimit] = useState(null);
  const [isValid, setIsValid] = useState();

  useEffect(() => {
    setIsValid(!!gapLimit);
  }, [gapLimit]);

  return (
    <Modal className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{modalTitle}</div>
      </div>
      <div>{modalContent}</div>
      <div className={styles.infoCloseButtonTop} onClick={onCancelModal} />
      <label className={styles.label}>
        <T id="discoverUsage.gapLimitLbl" m="Gap Limit" />
        <NumericInput
          id="gapLimitInput"
          amount={gapLimit?.value}
          onChangeAmount={setGapLimit}
          className={styles.gapLimitInput}
        />
      </label>
      {clicked && isValid === false && (
        <div className={styles.error}>
          <T id="discoverUsage.startErr" m="Fill all fields." />
        </div>
      )}
      <div className={styles.buttons}>
        <InvisiblePiUiButton onClick={onCancelModal}>
          <T id="discoverUsage.cancel" m="Cancel" />
        </InvisiblePiUiButton>
        <PiUiButton onClick={() => onSubmit(gapLimit)}>
          <T id="discoverUsage.save" m="Discover Address Usage" />
        </PiUiButton>
      </div>
    </Modal>
  );
};

export default DiscoverUsageModal;
