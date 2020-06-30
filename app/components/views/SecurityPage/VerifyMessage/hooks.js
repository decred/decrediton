import { useCallback } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export function useVerifyMessage() {
    const dispatch = useDispatch();
    const messageVerificationService = useSelector(sel.messageVerificationService);
    const verifyMessageError = useSelector(sel.verifyMessageError);
    const verifyMessageSuccess = useSelector(sel.verifyMessageSuccess);
    const isVerifyingMessage = useSelector(sel.isVerifyingMessage);

    const onVerifyMessageAttempt = useCallback(
        (address, message, sig) => 
            dispatch(ca.verifyMessageAttempt(address, message, sig)
        ), [dispatch]
    );
    const onVerifyMessageCleanStore = useCallback(
        () => dispatch(ca.verifyMessageCleanStore),
        [dispatch]  
    );
    const onGetMessageVerificationServiceAttempt = useCallback(
        () => dispatch(ca.getMessageVerificationServiceAttempt),
        [dispatch]  
    );

    return {
        messageVerificationService,
        verifyMessageError,
        verifyMessageSuccess,
        isVerifyingMessage,
        onVerifyMessageAttempt,
        onVerifyMessageCleanStore,
        onGetMessageVerificationServiceAttempt,
    }
}
