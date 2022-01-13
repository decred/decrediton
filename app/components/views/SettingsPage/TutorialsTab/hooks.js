import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";

export const useTutorialsTab = () => {
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [activeTabIndexes, setActiveTabIndexes] = useState({});
  const visitedTutorialTabs = useSelector(sel.visitedTutorialTabs) ?? {};

  const dispatch = useDispatch();
  const setVisitedTutorialTabs = useCallback(
    (visitedTabs) => dispatch(da.setVisitedTutorialTabs(visitedTabs)),
    [dispatch]
  );

  const viewTutorialHandler = (tutorialData) => {
    setCurrentTutorial(tutorialData);
  };

  const goBackHistory = () => setCurrentTutorial(null);

  return {
    currentTutorial,
    viewTutorialHandler,
    visitedTutorialTabs,
    setVisitedTutorialTabs,
    activeTabIndexes,
    setActiveTabIndexes,
    goBackHistory
  };
};
