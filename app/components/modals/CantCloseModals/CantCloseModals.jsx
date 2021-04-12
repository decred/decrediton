import { useMemo } from "react";
import PurchasingTicketsModal from "./PurchasingTicketsModal";
import AccountMixerRunningModal from "./AccountMixerRunningModal";
import AutobuyerRunning from "./AutobuyerRunningModal";
import DexOpenOrdersModal from "./DexOpenOrdersModal";
import HasTicketFeeErro from "./HasTicketFeeError";
import { useCantCloseModal } from "./hooks";
import { ConfirmModal } from "modals";

const CantCloseModals = (props) => {
  const { show, onSubmit, onCancelModal, modalContent } = props;
  const {
    autoBuyerRunning,
    hasUnpaidFee,
    cantCloseModalVisible,
    onHideCantCloseModal,
    shutdownApp,
    accountMixerRunning,
    purchasingTickets,
    dexOrdersOpen
  } = useCantCloseModal();

  const Component = useMemo(() => {
    if (autoBuyerRunning) {
      return AutobuyerRunning;
    } else if (hasUnpaidFee) {
      return HasTicketFeeErro;
    } else if (accountMixerRunning) {
      return AccountMixerRunningModal;
    } else if (purchasingTickets) {
      return PurchasingTicketsModal;
    } else if (dexOrdersOpen) {
      return DexOpenOrdersModal;
    }
    return;
  }, [
    autoBuyerRunning,
    hasUnpaidFee,
    accountMixerRunning,
    purchasingTickets,
    dexOrdersOpen
  ]);

  return Component ? (
    <Component
      show={show ?? cantCloseModalVisible}
      onSubmit={() => {
        if (onSubmit) {
          onSubmit();
        } else {
          shutdownApp();
        }
      }}
      onCancelModal={onCancelModal ?? onHideCantCloseModal}
    />
  ) : modalContent ? (
    <ConfirmModal {...props} />
  ) : (
    <></>
  );
};

export default CantCloseModals;
