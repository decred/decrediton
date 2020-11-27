import * as sel from "selectors";
import { hideCantCloseModal } from "actions/ControlActions";
import * as da from "actions/DaemonActions";
import { goToTicketsStatus } from "actions/ClientActions";
import { useSelector, useDispatch } from "react-redux";

export function useCantCloseModal() {
  const autBuyerRunning = useSelector(sel.isTicketAutoBuyerEnabled);
  const hasUnpaidFee = useSelector(sel.getHasUnpaidFee);
  const autobuyerRunningModalVisible = useSelector(sel.autobuyerRunningModalVisible);
  const runningIndicator = useSelector(sel.getRunningIndicator);
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const purchasingTickets = useSelector(sel.purchaseTicketsRequestAttempt);

  const dispatch = useDispatch();
  const onHideCantCloseModal = () => dispatch(hideCantCloseModal());
  const shutdownApp = () => dispatch(da.shutdownApp());
  const onGoToTicketsStatus = () => {
    dispatch(goToTicketsStatus());
    dispatch(hideCantCloseModal());
  };

  return {
    autBuyerRunning,
    hasUnpaidFee,
    autobuyerRunningModalVisible,
    onHideCantCloseModal,
    shutdownApp,
    onGoToTicketsStatus,
    runningIndicator,
    accountMixerRunning,
    purchasingTickets
  };
}
