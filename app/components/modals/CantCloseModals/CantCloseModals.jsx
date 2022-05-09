import { useMemo } from "react";
import PurchasingTicketsModal from "./PurchasingTicketsModal";
import AccountMixerRunningModal from "./AccountMixerRunningModal";
import AutobuyerRunning from "./AutobuyerRunningModal";
import DexOpenOrdersModal from "./DexOpenOrdersModal";
import HasTicketFeeError from "./HasTicketFeeError";
import { useCantCloseModal } from "./hooks";
import { ConfirmModal } from "modals";

const CantCloseModals = (props) => {
  const { show, onSubmit, onCancelModal, modalContent } = props;
  const {
    autoBuyerRunning,
    hasTicketFeeError,
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
    } else if (hasTicketFeeError) {
      return HasTicketFeeError;
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
    hasTicketFeeError,
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
