export const SNACKBAR_DISMISS_MESSAGES = "SNACKBAR_DISMISS_MESSAGES";
export function dismissAllMessages(newMessages) {
  return (dispatch) => {
    dispatch({ newMessages, type: SNACKBAR_DISMISS_MESSAGES });
  };
}

export const SNACKBAR_SIMPLE_MESSAGE = "SNACKBAR_SIMPLE_MESSAGE";
export const dispatchSingleMessage = (message) => (dispatch) => {
  dispatch({ type: SNACKBAR_SIMPLE_MESSAGE, message });
};
