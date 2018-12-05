import { ImportScriptModal } from "modals";
import { importScript } from "connectors";
import { Tooltip } from "shared";
import ModalButton from "./ModalButton";
import InvisibleButton from "./InvisibleButton";
import { FormattedMessage as T } from "react-intl";
import { SimpleLoading } from "indicators";

const ImportScriptIconButton = ({ rescanRequest, isImportingScript, onImportScript }) => (
  <Tooltip className="stakepool-content-import-script-button-tooltip-container"
    warning={!!rescanRequest}
    text={!rescanRequest
      ? <T id="purchaseTickets.import" m="Manually import a redeem script for tickets." />
      : <T id="purchaseTickets.importDisabledRescan" m="Importing scripts is disabled during a rescan." />}
  >
    <ModalButton
      buttonComponent={InvisibleButton}
      buttonLabel={isImportingScript ? <SimpleLoading /> : null}
      className={"stakepool-content-import-script-button " + (isImportingScript ? "loading" : "")}
      modalTitle={<T id="tickets.importScriptConfirmation" m="Import Script Confirmation" />}
      modalComponent={ImportScriptModal}
      disabled={rescanRequest}
      onSubmit={onImportScript}
    />
  </Tooltip>
);

export default importScript(ImportScriptIconButton);
