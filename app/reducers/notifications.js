import { TRANSACTIONNFTNS_START, TRANSACTIONNFTNS_FAILED, 
  TRANSACTIONNFTNS_DATA, TRANSACTIONNFTNS_END } from '../actions/NotificationActions';

export default function notifications(state = {}, action) {
  switch (action.type) {
    case TRANSACTIONNFTNS_START:
      return {...state,
        transactionNtfnsAttempt: true,
        transactionNtfnsRequest: action.request,
      };
    case TRANSACTIONNFTNS_FAILED:
    case TRANSACTIONNFTNS_DATA:
      return {...state,
        transactionNtfnsResponse: action.response,
      };
    case TRANSACTIONNFTNS_END:
    default:
      return state;
  }
}