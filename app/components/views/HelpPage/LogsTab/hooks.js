import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useLogging = () => {
  const walletReady = useSelector(sel.getWalletReady);
  const isDaemonRemote = useSelector(sel.isDaemonRemote);
  const isDaemonStarted = useSelector(sel.getDaemonStarted);
  const lnActive = useSelector(sel.lnActive);
  const lnStartAttempt = useSelector(sel.lnStartAttempt);

  return {
    walletReady,
    isDaemonRemote,
    isDaemonStarted,
    lnActive,
    lnStartAttempt
  };
};
