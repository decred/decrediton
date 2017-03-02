import { TRANSACTIONNFTNS_START, TRANSACTIONNFTNS_FAILED,
  TRANSACTIONNFTNS_DATA, TRANSACTIONNFTNS_SYNCING, TRANSACTIONNFTNS_END } from '../actions/NotificationActions';
import { SPENTNESSNFTNS_START, SPENTNESSNFTNS_FAILED,
  SPENTNESSNFTNS_DATA, SPENTNESSNFTNS_END } from '../actions/NotificationActions';
import { ACCOUNTNFTNS_START, ACCOUNTNFTNS_FAILED,
  ACCOUNTNFTNS_DATA, ACCOUNTNFTNS_END } from '../actions/NotificationActions';

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
  case TRANSACTIONNFTNS_SYNCING:
    return {...state,
      currentHeight: action.currentHeight,
    };  
  case TRANSACTIONNFTNS_END:
  case SPENTNESSNFTNS_START:
    return {...state,
      spentnessNtfnsAttempt: true,
      spentnessNtfnsRequest: action.request,
    };
  case SPENTNESSNFTNS_FAILED:
  case SPENTNESSNFTNS_DATA:
    return {...state,
      spentnessNtfnsResponse: action.response,
    };
  case SPENTNESSNFTNS_END:
  case ACCOUNTNFTNS_START:
    return {...state,
      accountNtfnsAttempt: true,
      accountNtfnsRequest: action.request,
    };
  case ACCOUNTNFTNS_FAILED:
  case ACCOUNTNFTNS_DATA:
    return {...state,
      accountNtfnsResponse: action.response,
    };
  case ACCOUNTNFTNS_END:
  default:
    return state;
  }
}