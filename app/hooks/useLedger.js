import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import * as sel from "selectors";
import * as ldgr from "actions/LedgerActions";

const useLedger = () => {
  const isLedger = useSelector(sel.isLedger);
  const device = useSelector(sel.ledgerDevice);
  const walletCreationMasterPubkeyAttempt = useSelector(
    sel.ledgerWalletCreationMasterPubkeyAttempt
  );

  const dispatch = useDispatch();

  const onConnect = useCallback(() => dispatch(ldgr.connect()), [dispatch]);
  const onEnableLedger = useCallback(
    () => dispatch(ldgr.enableLedger()),
    [dispatch]
  );

  return {
    isLedger,
    device,
    walletCreationMasterPubkeyAttempt,
    onConnect,
    onEnableLedger
  };
};

export default useLedger;
