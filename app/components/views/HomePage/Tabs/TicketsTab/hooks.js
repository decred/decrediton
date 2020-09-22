import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useTickets() {
  const totalValueOfLiveTickets = useSelector(sel.totalValueOfLiveTickets);
  const earnedStakingReward = useSelector(sel.totalSubsidy);
  const activeTicketsCount = useSelector(sel.activeTicketsCount);
  const votedTicketsCount = useSelector(sel.votedTicketsCount);
  const ticketDataChart = useSelector(sel.ticketDataChart);

  return {
    totalValueOfLiveTickets,
    earnedStakingReward,
    activeTicketsCount,
    votedTicketsCount,
    ticketDataChart
  };
};
