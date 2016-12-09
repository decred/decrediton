import { transactionNtfs } from '../middleware/grpc/client';

export const TRANSACTIONNFTNS_START = 'TRANSACTIONNFTNS_START';
export const TRANSACTIONNFTNS_FAILED = 'TRANSACTIONNFTNS_FAILED';
export const TRANSACTIONNFTNS_DATA = 'TRANSACTIONNFTNS_DATA';
export const TRANSACTIONNFTNS_END = 'TRANSACTIONNFTNS_END';

function transactionNftnsError(error) {
  return { error, type: TRANSACTIONNFTNS_FAILED};
}

function transactionNtfnsData(response) {
  return { response: response, type: TRANSACTIONNFTNS_DATA };
}

export function transactionNftnsStart() {
  var request = {}
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNFTNS_START });
    dispatch(startTransactionNtfns());
  }
}

export function transactionNftnsEnd() {
  var request = {}
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNFTNS_END });
    //
  }
}

function startTransactionNtfns() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { transactionNftnsRequest } = getState().notifications;
    transactionNtfs(client, transactionNftnsRequest,
      function(data) {
        console.log("Transaction received:", data);
        dispatch(startTransactionNtfns(data));
      }
    )
  }
}
