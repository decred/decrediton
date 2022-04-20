import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";

export const useStakingTabWarning = () => {
  const [activeTabIndexes, setActiveTabIndexes] = useState({});
  const visitedTutorialTabs = useSelector(sel.visitedTutorialTabs) ?? {};

  const dispatch = useDispatch();
  const setVisitedTutorialTabs = useCallback(
    (visitedTabs) => dispatch(da.setVisitedTutorialTabs(visitedTabs)),
    [dispatch]
  );

  return {
    visitedTutorialTabs,
    setVisitedTutorialTabs,
    activeTabIndexes,
    setActiveTabIndexes
  };
};
