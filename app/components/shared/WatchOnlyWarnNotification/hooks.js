import { useCallback } from "react";
import * as sa from "actions/SnackbarActions";
import { useDispatch } from "react-redux";

export function useWatchOnlyWarnNotification() {
  const dispatch = useDispatch();
  const dispatchSingleMessage = useCallback(
    (messages) => dispatch(sa.dispatchSingleMessage(messages)),
    [dispatch]
  );

  return {
    dispatchSingleMessage
  };
}
