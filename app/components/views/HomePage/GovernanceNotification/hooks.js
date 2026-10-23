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
  const tspendPolicies = useSelector(sel.tspendPolicies);
  const newNotYetVotedTSpendCount =
    (tspendPolicies &&
      tspendPolicies.filter((p) => p.policy === "abstain" || p.policy === "")
        .length) ??
    0;

  const dispatch = useDispatch();
  const goToConsensusChanges = () => dispatch(cla.goToConsensusChanges());
  const goToActiveProposals = () => dispatch(cla.goToActiveProposals());
  const goToTreasurySpending = () => dispatch(cla.goToTreasurySpending());

  return {
    newNotYetVotedAgendasCount,
    newNotYetVotedActiveProposalsCount,
    newNotYetVotedTSpendCount,
    goToConsensusChanges,
    goToActiveProposals,
    goToTreasurySpending
  };
}
