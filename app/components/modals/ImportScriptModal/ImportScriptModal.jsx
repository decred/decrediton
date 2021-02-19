import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import useImportScriptModal from "./hooks";
import { TextInput } from "inputs";
import Modal from "../Modal";
import style from "./ImportScriptModal.module.css";

const ImportScriptModal = ({ onCancelModal, onSubmit, show }) => {
  const {
    script,
    hasFailedAttempt,
    onCancelModalCallback,
    setScriptCallback,
    onSubmitCallback,
    isValid
  } = useImportScriptModal(onCancelModal, onSubmit);

  return (
    <Modal className={style.importRedeemScript} {...{ show, onCancelModal }}>
      <div className={style.importRedeemScriptTitle}>
        <T id="importRedeemScriptModal.title" m="Import Redeem Script" />
      </div>
      <div className={style.importRedeemScriptField}>
        <div className={style.importRedeemScriptLabel}>
          <T id="importRedeemScriptModal.label" m="Script:" />
        </div>
        <TextInput
          autoFocus
          required
          showErrors={hasFailedAttempt}
          id="script"
          type="text"
          placeholder=""
          value={script}
          className={style.importRedeemScriptInput}
          onChange={(e) => setScriptCallback(e.target.value)}
        />
      </div>
      <div className={style.importRedeemScriptButtons}>
        <InvisibleButton onClick={onCancelModalCallback}>
          <T id="importRedeemScriptModal.btnCancel" m="Cancel" />
        </InvisibleButton>
        <KeyBlueButton disabled={!isValid} onClick={onSubmitCallback}>
          <T id="importRedeemScriptModal.btnContinue" m="Continue" />
        </KeyBlueButton>
      </div>
    </Modal>
  );
};

export default ImportScriptModal;
