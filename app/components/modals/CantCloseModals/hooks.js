import * as sel from "selectors";
import { hideCantCloseModal } from "actions/ControlActions";
import * as da from "actions/DaemonActions";
import { useSelector, useDispatch } from "react-redux";

export function useCantCloseModal() {
  const autoBuyerRunning = useSelector(sel.isTicketAutoBuyerEnabled);
  const hasUnpaidFee = useSelector(sel.getHasTicketFeeError);
  const cantCloseModalVisible = useSelector(sel.cantCloseModalVisible);
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const purchasingTickets = useSelector(sel.purchaseTicketsRequestAttempt);
  const ticketAutoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);

  const dispatch = useDispatch();
  const onHideCantCloseModal = () => dispatch(hideCantCloseModal());
  const shutdownApp = () => dispatch(da.shutdownApp());

  return {
    autoBuyerRunning: autoBuyerRunning || ticketAutoBuyerRunning,
    hasUnpaidFee,
    cantCloseModalVisible,
    onHideCantCloseModal,
    shutdownApp,
    accountMixerRunning,
    purchasingTickets
  };
}
