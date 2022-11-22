import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";

export const usePagedTutorial = () => {
  const location = useSelector(sel.location);
  const dispatch = useDispatch();
  const onGoBackHistory = useCallback(
    () => dispatch(ca.goBackHistory()),
    [dispatch]
  );
  return {
    location,
    onGoBackHistory
  };
};
