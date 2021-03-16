import { useDispatch, useSelector } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as tza from "actions/TrezorActions";

export function useSendTransactionButton() {
  const unsignedTransaction = useSelector(sel.unsignedTransaction);
  const constructTxResponse = useSelector(sel.constructTxResponse);
  const isSendingTransaction = useSelector(sel.isSendingTransaction);

  const dispatch = useDispatch();
  const onAttemptSignTransaction = (passphrase, rawTx) =>
    dispatch(ca.signTransactionAttempt(passphrase, rawTx));
  const onAttemptSignTransactionTrezor = (rawUnsigTx, constructTxResponse) =>
    dispatch(tza.signTransactionAttemptTrezor(rawUnsigTx, constructTxResponse));

  return {
    unsignedTransaction,
    constructTxResponse,
    isSendingTransaction,
    onAttemptSignTransaction,
    onAttemptSignTransactionTrezor
  };
}
