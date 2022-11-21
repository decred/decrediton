import * as sel from "selectors";
import { hideCantCloseModal } from "actions/ControlActions";
import * as da from "actions/DaemonActions";
import { useSelector, useDispatch } from "react-redux";
import { useVSP } from "hooks";

export function useCantCloseModal() {
  const { hasTicketFeeError } = useVSP();
  const cantCloseModalVisible = useSelector(sel.cantCloseModalVisible);
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const purchasingTickets = useSelector(sel.purchaseTicketsRequestAttempt);
  const autoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const dexOrdersOpen = useSelector(sel.dexOrdersOpen);

  const dispatch = useDispatch();
  const onHideCantCloseModal = () => dispatch(hideCantCloseModal());
  const shutdownApp = () => dispatch(da.shutdownApp());

  return {
    autoBuyerRunning,
    hasTicketFeeError,
    cantCloseModalVisible,
    onHideCantCloseModal,
    shutdownApp,
    accountMixerRunning,
    purchasingTickets,
    dexOrdersOpen
  };
}
