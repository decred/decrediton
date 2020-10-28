import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as da from "actions/DaemonActions";
import { useSelector, useDispatch } from "react-redux";

export function useCantCloseModal() {
  const autBuyerRunning = useSelector(sel.isTicketAutoBuyerEnabled);
  const hasUnpaidFee = useSelector(sel.getHasUnpaidFee);
  const autobuyerRunningModalVisible = useSelector(sel.autobuyerRunningModalVisible);
  const dispatch = useDispatch();
  const hideCantCloseModal = () => dispatch(ca.hideCantCloseModal());
  const shutdownApp = () => dispatch(da.shutdownApp());

  return {
    autBuyerRunning,
    hasUnpaidFee,
    autobuyerRunningModalVisible,
    hideCantCloseModal,
    shutdownApp
  };
}
