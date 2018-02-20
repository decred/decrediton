export const SNACKBAR_DISMISS_MESSAGES = "SNACKBAR_DISMISS_MESSAGES";
export function dismissAllMessages() {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_DISMISS_MESSAGES });
  };
}
