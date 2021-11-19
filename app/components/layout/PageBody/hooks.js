import { useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMountEffect } from "hooks";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export const usePageBody = () => {
  const pageBodyScrollHandler = useSelector(sel.pageBodyScrollHandler);

  const pageBodyTopRef = useRef();
  useMountEffect(() => {
    setPageBodyRef(pageBodyTopRef);
  });

  const dispatch = useDispatch();
  const setPageBodyRef = useCallback(
    (ref) => dispatch(ca.setPageBodyRef(ref)),
    [dispatch]
  );

  return {
    pageBodyScrollHandler,
    pageBodyTopRef
  };
};
