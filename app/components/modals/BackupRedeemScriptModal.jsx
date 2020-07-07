import InfoConfirmModal from "./InfoConfirmModal";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import style from "./Modals.module.css";

const Content = ({ script, key }) => (
  <>
    <div key={key} className={style.backupRedeemScriptMessage}>
      <T
        id="backup.redeem.script.message"
        m={`You must make a backup of the redeem script.
          If the VSP closes without notifying and you do not have access to your redeem script {warnMessage}`}
        values={{
          warnMessage: (
            <span className={classNames("error","bold")}>
              <T
                id="backup.redeem.script.warn"
                m="your funds may be lost forever."
              />
            </span>
          )
        }}
      />
    </div>
    <div className={style.backupRedeemScriptTitle}>
      <T id="backup.redeem.script.title" m="Script" />
    </div>
    <textarea
      disabled
      value={script}
      className={style.backupRedeemScriptTextarea}
    />
  </>
);

export default ({ show, onCancelModal, className, script }) => (
  <InfoConfirmModal
    {...{ show, onCancelModal, className }}
    modalTitle={
      <T id="backup.redeem.script.modal.title" m="Backup Redeem Script" />
    }
    modalContent={Content({ script })}
  />
);
