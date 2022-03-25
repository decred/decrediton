import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as cla from "actions/ClientActions";

export function useGovernanceNotification() {
  const newNotYetVotedAgendasCount = useSelector(
    sel.newNotYetVotedAgendasCount
  );
  const newNotYetVotedActiveProposalsCount = useSelector(
    sel.newNotYetVotedActiveProposalsCount
  );

  const dispatch = useDispatch();
  const goToConsensusChanges = () => dispatch(cla.goToConsensusChanges());
  const goToActiveProposals = () => dispatch(cla.goToActiveProposals());

  return {
    newNotYetVotedAgendasCount,
    newNotYetVotedActiveProposalsCount,
    goToConsensusChanges,
    goToActiveProposals
  };
}
