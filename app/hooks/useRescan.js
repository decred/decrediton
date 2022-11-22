import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

const useRescan = () => {
  const rescanRequest = useSelector(sel.rescanRequest);
  const rescanStartBlock = useSelector(sel.rescanStartBlock);
  const rescanEndBlock = useSelector(sel.rescanEndBlock);
  const rescanCurrentBlock = useSelector(sel.rescanCurrentBlock);
  const rescanPercentFinished = useSelector(sel.rescanPercentFinished);

  const dispatch = useDispatch();

  const rescanAttempt = useCallback(
    () => dispatch(ca.rescanAttempt()),
    [dispatch]
  );
  const rescanCancel = useCallback(
    () => dispatch(ca.rescanCancel()),
    [dispatch]
  );

  return {
    rescanRequest,
    rescanStartBlock,
    rescanEndBlock,
    rescanCurrentBlock,
    rescanPercentFinished,
    rescanAttempt,
    rescanCancel
  };
};

export default useRescan;
