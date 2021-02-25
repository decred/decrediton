import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
import { ImportScriptModal } from "modals";
import { importScript } from "connectors";
import ModalButton from "./ModalButton";
import InvisibleButton from "./InvisibleButton";
import { SimpleLoading } from "indicators";

const ImportScriptIconButton = ({
  rescanRequest,
  isImportingScript,
  onImportScript
}) => (
  <Tooltip
    warning={!!rescanRequest}
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
        "stakepool-content-import-script-button",
        isImportingScript && "loading"
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
    />
  </Tooltip>
);

export default importScript(ImportScriptIconButton);
