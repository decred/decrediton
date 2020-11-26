import AutobuyerRunning from "./AutobuyerRunningModal";
import HasTicketFeeErro from "./HasTicketFeeError";
import { useCantCloseModal } from "./hooks";

const CantCloseModals = () => {
  const {
    autBuyerRunning,
    hasUnpaidFee,
    autobuyerRunningModalVisible,
    onHideCantCloseModal,
    shutdownApp,
    runningIndicator
  } = useCantCloseModal();
  let Component = () => <></>;

  if (autBuyerRunning) {
    Component = AutobuyerRunning;
  }
  if (hasUnpaidFee) {
    Component = HasTicketFeeErro;
  }
  if (runningIndicator) {
    Component = AutobuyerRunning;
  }

  return <Component
    show={autobuyerRunningModalVisible}
    onSubmit={() => {
      onHideCantCloseModal();
      shutdownApp();
    }}
    onCancelModal={onHideCantCloseModal}
  />;
};

export default CantCloseModals;
