import { useMemo } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { LIVE, UNMINED, IMMATURE, VSP_FEE_PROCESS_ERRORED } from "constants";
import { cloneDeep } from "fp";

const useVSP = () => {
  const vspTicketsHashes = useSelector(sel.getVSPTicketsHashes);
  const stakeTransactions = useSelector(sel.stakeTransactions);

  // getVSPTickets returns an object with feeStatus as keys
  // and an array of tickets which have this feeStatus.
  const vspTickets = useMemo(() => {
    if (!vspTicketsHashes) return;
    const vspTickets = {};
    Object.keys(vspTicketsHashes).forEach((feeStatus) => {
      // fee status vspTicketsHashes
      vspTicketsHashes[feeStatus].forEach((hash) => {
        if (!vspTickets[feeStatus]) {
          vspTickets[feeStatus] = [];
        }
        if (!hash) return;
        // right now we only show fee status for tickets which can be voted.
        if (!stakeTransactions[hash]) {
          // it should not have an uknown tx. If there is, we should get this tx
          // before showing the vsp tickets.
          return null;
        }
        if (
          stakeTransactions[hash].status === IMMATURE ||
          stakeTransactions[hash].status === LIVE ||
          stakeTransactions[hash].status === UNMINED
        ) {
          const objCopy = cloneDeep(stakeTransactions[hash]);
          objCopy.feeStatus = feeStatus;
          vspTickets[feeStatus] = [objCopy, ...vspTickets[feeStatus]];
        }
        return null;
      });
    });
    return vspTickets;
  }, [vspTicketsHashes, stakeTransactions]);

  const hasTicketFeeError = useMemo(
    () =>
      vspTickets &&
      vspTickets[VSP_FEE_PROCESS_ERRORED] &&
      vspTickets[VSP_FEE_PROCESS_ERRORED].length > 0,
    [vspTickets]
  );

  return {
    vspTickets,
    hasTicketFeeError
  };
};

export default useVSP;
