import AutobuyerRunning from "./AutobuyerRunningModal";
import HasTicketFeeErro from "./HasTicketFeeError";
import { useCantCloseModal } from "./hooks";

const CantCloseModals = () => {
  const {
    autBuyerRunning,
    hasUnpaidFee,
    autobuyerRunningModalVisible,
    hideCantCloseModal,
    shutdownApp
  } = useCantCloseModal();
  let Component = () => <></>;

  if (autBuyerRunning) {
    Component = AutobuyerRunning;
  }
  if (hasUnpaidFee) {
    Component = HasTicketFeeErro;
  }

  return <Component
    show={autobuyerRunningModalVisible}
    onSubmit={() => {
      hideCantCloseModal();
      shutdownApp();
    }}
    onCancelModal={hideCantCloseModal}
  />;
};

export default CantCloseModals;
