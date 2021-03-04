import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useStakeInfo() {
  const ticketPoolSize = useSelector(sel.ticketPoolSize);
  const votedTicketsCount = useSelector(sel.votedTicketsCount);
  const allMempoolTicketsCount = useSelector(sel.allMempoolTicketsCount);
  const missedTicketsCount = useSelector(sel.missedTicketsCount);
  const ownMempoolTicketsCount = useSelector(sel.ownMempoolTicketsCount);
  const revokedTicketsCount = useSelector(sel.revokedTicketsCount);
  const immatureTicketsCount = useSelector(sel.immatureTicketsCount);
  const expiredTicketsCount = useSelector(sel.expiredTicketsCount);
  const liveTicketsCount = useSelector(sel.liveTicketsCount);
  const unspentTicketsCount = useSelector(sel.unspentTicketsCount);
  const totalSubsidy = useSelector(sel.totalSubsidy);
  const isSPV = useSelector(sel.isSPV);
  const lastVotedTicket = useSelector(sel.lastVotedTicket);
  const currencyDisplay = useSelector(sel.currencyDisplay);
  const tsDate = useSelector(sel.tsDate);

  return {
    ticketPoolSize,
    votedTicketsCount,
    allMempoolTicketsCount,
    missedTicketsCount,
    ownMempoolTicketsCount,
    revokedTicketsCount,
    immatureTicketsCount,
    expiredTicketsCount,
    liveTicketsCount,
    unspentTicketsCount,
    totalSubsidy,
    isSPV,
    lastVotedTicket,
    currencyDisplay,
    tsDate
  };
}
