import { ConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";

const ConfirmRestartModal = (props) => (
  <ConfirmModal
    modalTitle={<T id="settings.resetNetworkTitle" m="Reset required" />}
    buttonLabel={<T id="settings.save" m="Save" />}
    modalContent={
      <T
        id="settings.resetNetworkContent"
        m="The setting you have chosen to change requires Decrediton to be restarted.  Please confirm this action before proceeding."
      />
    }
    size="large"
    block={false}
    {...props}
  />
);

export default ConfirmRestartModal;
