export const SNACKBAR_DISMISS_MESSAGES = "SNACKBAR_DISMISS_MESSAGES";
export function dismissAllMessages() {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_DISMISS_MESSAGES });
  };
}

export const SNACKBAR_SIMPLE_MESSAGE = "SNACKBAR_SIMPLE_MESSAGE";
export const dispatchSingleMessage = (message) => (dispatch) => {
  dispatch({ type: SNACKBAR_SIMPLE_MESSAGE, message });
};
