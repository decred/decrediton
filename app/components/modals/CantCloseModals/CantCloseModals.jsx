import PurchasingTicketsModal from "./PurchasingTicketsModal";
import AccountMixerRunningModal from "./AccountMixerRunningModal";
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
    accountMixerRunning,
    purchasingTickets
  } = useCantCloseModal();
  let Component = () => <></>;
  if (autBuyerRunning) {
    Component = AutobuyerRunning;
  }
  if (hasUnpaidFee) {
    Component = HasTicketFeeErro;
  }
  if (accountMixerRunning) {
    Component = AccountMixerRunningModal;
  }
  if (purchasingTickets) {
    Component = PurchasingTicketsModal;
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
