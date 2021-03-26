import { useDispatch, useSelector } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as tza from "actions/TrezorActions";

export function useSendTransactionButton() {
  const unsignedTransaction = useSelector(sel.unsignedTransaction);
  const constructTxResponse = useSelector(sel.constructTxResponse);
  const isSendingTransaction = useSelector(sel.isSendingTransaction);
  const isTrezor = useSelector(sel.isTrezor);

  const dispatch = useDispatch();
  const onAttemptSignTransaction = (passphrase, rawTx, acct) => {
    dispatch(ca.signTransactionAttempt(passphrase, rawTx, acct));
  };
  const onAttemptSignTransactionTrezor = (rawUnsigTx, constructTxResponse) =>
    dispatch(
      tza.signTransactionAttemptTrezor(rawUnsigTx, [
        constructTxResponse.changeIndex
      ])
    );

  return {
    unsignedTransaction,
    constructTxResponse,
    isSendingTransaction,
    isTrezor,
    onAttemptSignTransaction,
    onAttemptSignTransactionTrezor
  };
}
