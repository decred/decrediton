import { keyBy } from "fp";
import { useEffect, useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePrevious } from "hooks";
import * as sa from "../../actions/SnackbarActions";
import * as sel from "../../selectors";
import { useMountEffect } from "hooks";

export function useSnackbar() {
  const snackbarMessages = useSelector(sel.snackbarMessages);
  const uiAnimations = useSelector(sel.uiAnimations);
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();
  const previous = usePrevious({ snackbarMessages });

  const dispatch = useDispatch();
  const onDismissAllMessages = useCallback(
    (messages) => dispatch(sa.dismissAllMessages(messages)),
    [dispatch]
  );

  useMountEffect(() => {
    return () => {
      {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };
  });

  const clearHideTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [intervalRef]);

  const enableHideTimer = useCallback(() => {
    clearHideTimer();
    // emulating progress
    const id = setInterval(() => setProgress((p) => p + 10), 500);
    intervalRef.current = id;
  }, [clearHideTimer, intervalRef, setProgress]);

  useEffect(() => {
    if (previous && previous.snackbarMessages === snackbarMessages) {
      return;
    }
    if (snackbarMessages.length > 0) {
      enableHideTimer();
    } else {
      clearHideTimer();
    }

    const messagesByKey = keyBy(messages, "key");
    const newMessages = snackbarMessages.map((m) =>
      messagesByKey[m.key] ? messagesByKey[m.key] : m
    );
    setMessages(newMessages);
  }, [
    snackbarMessages,
    enableHideTimer,
    messages,
    setMessages,
    previous,
    clearHideTimer
  ]);

  const onDismissMessage = useCallback(() => {
    const newMessages = [...snackbarMessages];
    newMessages.shift();
    setProgress(0);
    // dismiss single message of the one popped
    onDismissAllMessages(newMessages);
  }, [snackbarMessages, onDismissAllMessages, setProgress]);

  useEffect(() => {
    if (progress >= 100) {
      onDismissMessage();
    }
  }, [progress, snackbarMessages, onDismissMessage]);

  return {
    uiAnimations,
    messages,
    setMessages,
    progress,
    clearHideTimer,
    enableHideTimer,
    onDismissMessage
  };
}
