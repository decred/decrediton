import { useState } from "react";
import { useSettings } from "hooks";
import { useSelector } from "react-redux";
import { useDaemonStartup } from "hooks";
import { getAvailableVSPs } from "selectors";

export const useProcessUnmanagedTickets = ({ send }) => {
  const { onProcessUnmanagedTickets, isProcessingUnmanaged } =
    useDaemonStartup();
  const { isVSPListingEnabled } = useSettings();
  const availableVSPs = isVSPListingEnabled
    ? useSelector(getAvailableVSPs)
    : [];
  const [vsp, setVSP] = useState(null);

  const onSubmitContinue = (passphrase) => {
    onProcessUnmanagedTickets(passphrase, vsp.host, vsp.pubkey)
      .then(() => send({ type: "CONTINUE" }))
      .catch((error) => {
        send({ type: "ERROR", error });
      });
  };

  return {
    isProcessingUnmanaged,
    availableVSPs,
    vsp,
    setVSP,
    onSubmitContinue
  };
};
