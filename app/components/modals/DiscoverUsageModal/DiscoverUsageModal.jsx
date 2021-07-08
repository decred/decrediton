import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import Modal from "../Modal";
import styles from "./DiscoverUsageModal.module.css";
import { SettingsTextInput } from "inputs";
import { PiUiButton, InvisiblePiUiButton } from "buttons";

const messages = defineMessages({
  gapLimit: {
    id: "settings.GapLimit.placeholder",
    defaultMessage: "Gap Limit"
  }
});

const DiscoverUsageModal = ({
  onCancelModal,
  onSubmit,
  show,
  gapLimit,
  setGapLimit,
  isValid,
  intl
}) => {
  console.log(gapLimit.value);
  return (
    <Modal className={styles.modal} {...{ show }}>
      <div className={styles.title}>
          <T id="settings.discoverUsage" m="Discover Address Usage" />
      </div>
      <div className={styles.content}>
        <T
          id="settings.discoverUsageContent"
          m="In some rare circumstances, addresses may not be discovered with the default gap limit of 20.  It's recommended to only use this functionality after trying other options and discussing with Support staff.  And be aware that raising the gap limit above 100 will lead to excessive loading times to complete this request."
        />
      </div>
      <div className={styles.infoCloseButtonTop} onClick={onCancelModal} />
      <label className={styles.label}>
        <T id="discoverUsage.gapLimitLbl" m="Gap Limit" />
      </label>
      <SettingsTextInput
        id="gapLimitInput"
        value={gapLimit}
        placeholder={intl.formatMessage(messages.gapLimit)}
        onChange={setGapLimit}
        className={styles.gapLimitInput}
      />
      {isValid === false && (
        <div className={styles.error}>
          <T id="discoverUsage.startErr" m="Fill all fields." />
        </div>
      )}
      <div className={styles.buttons}>
        <InvisiblePiUiButton onClick={onCancelModal}>
          <T id="discoverUsage.cancel" m="Cancel" />
        </InvisiblePiUiButton>
        <PiUiButton disabled={!isValid} onClick={() => onSubmit(gapLimit)}>
          <T id="discoverUsage.save" m="Discover Address Usage" />
        </PiUiButton>
      </div>
    </Modal>
  );
};

export default injectIntl(DiscoverUsageModal);
