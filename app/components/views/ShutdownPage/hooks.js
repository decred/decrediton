import { useCallback } from "react";
import { useDispatch } from "react-redux";
import * as da from "actions/DaemonActions";

export const useShutdown = () => {
  const dispatch = useDispatch();
  const cleanShutdown = useCallback(
    () => dispatch(da.cleanShutdown()),
    [dispatch]
  );

  return { cleanShutdown };
};
