import { TRANSACTIONNTFNS_START, TRANSACTIONNTFNS_FAILED,
  TRANSACTIONNTFNS_DATA, TRANSACTIONNTFNS_SYNCING, TRANSACTIONNTFNS_END,
  TRANSACTIONNTFNS_DATA_UNMINED, TRANSACTIONNTFNS_DATA_UNMINED_UPDATE } from '../actions/NotificationActions';
import { SPENTNESSNTFNS_START, SPENTNESSNTFNS_FAILED,
  SPENTNESSNTFNS_DATA, SPENTNESSNTFNS_END } from '../actions/NotificationActions';
import { ACCOUNTNTFNS_START, ACCOUNTNTFNS_FAILED,
  ACCOUNTNTFNS_DATA, ACCOUNTNTFNS_END } from '../actions/NotificationActions';

export default function notifications(state = {}, action) {
  switch (action.type) {
  case TRANSACTIONNTFNS_START:
    return {...state,
      transactionNtfnsAttempt: true,
      transactionNtfnsRequest: action.request,
    };
  case TRANSACTIONNTFNS_FAILED:
  case TRANSACTIONNTFNS_DATA:
    return {...state,
      transactionNtfnsResponse: action.response,
      synced: true,
    };
  case TRANSACTIONNTFNS_SYNCING:
    return {...state,
      currentHeight: action.currentHeight,
      synced: false,
      timeBackString: action.timeBackString,
    };
  case TRANSACTIONNTFNS_DATA_UNMINED:
    return {...state,
      unmined: [
        ...state.unmined,
        action.unmined,
      ]
    };
  case TRANSACTIONNTFNS_DATA_UNMINED_UPDATE:
    return {...state,
      unmined: action.unmined,
    };
  case TRANSACTIONNTFNS_END:
  case SPENTNESSNTFNS_START:
    return {...state,
      spentnessNtfnsAttempt: true,
      spentnessNtfnsRequest: action.request,
    };
  case SPENTNESSNTFNS_FAILED:
  case SPENTNESSNTFNS_DATA:
    return {...state,
      spentnessNtfnsResponse: action.response,
    };
  case SPENTNESSNTFNS_END:
  case ACCOUNTNTFNS_START:
    return {...state,
      accountNtfnsAttempt: true,
      accountNtfnsRequest: action.request,
    };
  case ACCOUNTNTFNS_FAILED:
  case ACCOUNTNTFNS_DATA:
    return {...state,
      accountNtfnsResponse: action.response,
    };
  case ACCOUNTNTFNS_END:
  default:
    return state;
  }
}