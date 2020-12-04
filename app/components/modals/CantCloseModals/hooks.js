import * as sel from "selectors";
import { hideCantCloseModal } from "actions/ControlActions";
import * as da from "actions/DaemonActions";
import { useSelector, useDispatch } from "react-redux";

export function useCantCloseModal() {
  const autoBuyerRunning = useSelector(sel.isTicketAutoBuyerEnabled);
  const hasUnpaidFee = useSelector(sel.getHasUnpaidFee);
  const autobuyerRunningModalVisible = useSelector(
    sel.autobuyerRunningModalVisible
  );
  const runningIndicator = useSelector(sel.getRunningIndicator);
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const purchasingTickets = useSelector(sel.purchaseTicketsRequestAttempt);

  const dispatch = useDispatch();
  const onHideCantCloseModal = () => dispatch(hideCantCloseModal());
  const shutdownApp = () => dispatch(da.shutdownApp());

  return {
    autoBuyerRunning,
    hasUnpaidFee,
    autobuyerRunningModalVisible,
    onHideCantCloseModal,
    shutdownApp,
    runningIndicator,
    accountMixerRunning,
    purchasingTickets
  };
}
