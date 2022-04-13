import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendVSPDVoteChoices } from "actions/VSPActions";
import * as sel from "selectors";

export const useResendVotesToRecentlyUpdatedVSPs = () => {
  const resendVSPDVoteChoicesAttempt = useSelector(
    sel.resendVSPDVoteChoicesAttempt
  );

  const dispatch = useDispatch();
  const onResendVSPDVoteChoices = useCallback(
    (vsps, passphrase) => dispatch(resendVSPDVoteChoices(vsps, passphrase)),
    [dispatch]
  );

  return {
    resendVSPDVoteChoicesAttempt,
    onResendVSPDVoteChoices
  };
};
