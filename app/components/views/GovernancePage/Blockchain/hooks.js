import * as sel from "selectors";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ClientActions";
import * as spa from "actions/VSPActions";

export function useVotingPrefs() {
  const dispatch = useDispatch();
  const configuredStakePools = useSelector(sel.configuredStakePools);
  const defaultStakePool = useSelector(sel.defaultStakePool);
  const stakePool = useSelector(sel.selectedStakePool);
  const allAgendas = useSelector(sel.allAgendas);
  const onUpdateVotePreference = useCallback(
    () => dispatch(ca.setVoteChoicesAttempt),
    [dispatch]
  );
  const onChangeStakePool = useCallback(
    () => dispatch(spa.changeSelectedStakePool),
    [dispatch]
  );
  return {
    configuredStakePools,
    defaultStakePool,
    stakePool,
    allAgendas,
    onUpdateVotePreference,
    onChangeStakePool
  };
}
