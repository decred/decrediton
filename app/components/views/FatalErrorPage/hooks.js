import * as sel from "selectors";
import * as da from "actions/DaemonActions";
import { useSelector, useDispatch } from "react-redux";

export function useFatalErrorPage() {
  const dispatch = useDispatch();
  const isAdvancedDaemon = useSelector(sel.isAdvancedDaemon);
  const daemonError = useSelector(sel.daemonError);
  const walletError = useSelector(sel.walletError);

  const shutdownApp = () => dispatch(da.shutdownApp());
  const backToCredentials = () => dispatch(da.backToCredentials());
  const deleteDaemonData = () => dispatch(da.deleteDaemonData());

  return {
    daemonError,
    walletError,
    isAdvancedDaemon,
    shutdownApp,
    backToCredentials,
    deleteDaemonData
  };
}
