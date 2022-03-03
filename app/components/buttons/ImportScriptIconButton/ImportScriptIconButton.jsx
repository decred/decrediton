import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
import { ImportScriptModal } from "modals";
import ModalButton from "../ModalButton";
import InvisibleButton from "../InvisibleButton";
import { SimpleLoading } from "indicators";
import { useImportScriptIconButton } from "./hooks";
import styles from "./ImportScriptIconButton.module.css";

const ImportScriptIconButton = ({ ariaLabel }) => {
  const {
    rescanRequest,
    isImportingScript,
    onImportScript
  } = useImportScriptIconButton();

  return (
    <Tooltip
      warning={(!!rescanRequest).toString()}
      content={
        !rescanRequest ? (
          <T
            id="purchaseTickets.import"
            m="Manually import a redeem script for tickets."
          />
        ) : (
          <T
            id="purchaseTickets.importDisabledRescan"
            m="Importing scripts is disabled during a rescan."
          />
        )
      }>
      <ModalButton
        buttonComponent={InvisibleButton}
        buttonLabel={isImportingScript ? <SimpleLoading /> : null}
        className={classNames(
          styles.stakepoolContentImportScriptButton,
          isImportingScript && styles.loading
        )}
        modalTitle={
          <T
            id="tickets.importScriptConfirmation"
            m="Import Script Confirmation"
          />
        }
        modalComponent={ImportScriptModal}
        disabled={rescanRequest}
        onSubmit={onImportScript}
        ariaLabel={ariaLabel}
      />
    </Tooltip>
  );
};

export default ImportScriptIconButton;
