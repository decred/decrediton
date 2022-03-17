import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as cla from "actions/ClientActions";

export function useGovernanceNotification() {
  const newNotYetVotedAgendasCount = useSelector(
    sel.newNotYetVotedAgendasCount
  );

  const dispatch = useDispatch();
  const goToConsensusChanges = () => dispatch(cla.goToConsensusChanges());

  return {
    newNotYetVotedAgendasCount,
    goToConsensusChanges
  };
}
