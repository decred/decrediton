import { TRANSACTIONNTFNS_START, TRANSACTIONNTFNS_FAILED,
  TRANSACTIONNTFNS_DATA, TRANSACTIONNTFNS_SYNCING, TRANSACTIONNTFNS_END,
  TRANSACTIONNTFNS_DATA_UNMINED, TRANSACTIONNTFNS_DATA_UNMINED_UPDATE } from "../actions/NotificationActions";
import { ACCOUNTNTFNS_START, ACCOUNTNTFNS_FAILED,
  ACCOUNTNTFNS_DATA, ACCOUNTNTFNS_END } from "../actions/NotificationActions";
import { CLEARUNMINEDMESSAGE }  from "../actions/NotificationActions";

export default function notifications(state = {}, action) {
  switch (action.type) {
  case TRANSACTIONNTFNS_START:
    return {...state,
      transactionNtfnsAttempt: true,
      transactionNtfns: action.transactionNtfns,
    };
  case TRANSACTIONNTFNS_FAILED:
    return {...state,
      transactionNtfns: null,
    };
  case TRANSACTIONNTFNS_DATA:
    return {...state,
      transactionNtfnsResponse: action.response,
      synced: true,
    };
  case TRANSACTIONNTFNS_SYNCING:
    return {...state,
      currentHeight: action.currentHeight,
      synced: false,
      syncedToTimestamp: action.syncedToTimestamp,
    };
  case TRANSACTIONNTFNS_DATA_UNMINED:
    return {...state,
      unmined: [
        ...state.unmined,
        action.unmined,
      ],
      newUnminedMessage: action.unminedMessage,
    };
  case TRANSACTIONNTFNS_DATA_UNMINED_UPDATE:
    return {...state,
      unmined: action.unmined,
    };
  case TRANSACTIONNTFNS_END:
    return {...state,
      transactionNtfns: null,
    };
  case ACCOUNTNTFNS_START:
    return {...state,
      accountNtfnsAttempt: true,
    };
  case ACCOUNTNTFNS_FAILED:
  case ACCOUNTNTFNS_DATA:
    return {...state,
      accountNtfnsResponse: action.response,
    };
  case ACCOUNTNTFNS_END:
  case CLEARUNMINEDMESSAGE:
    return {...state,
      newUnminedMessage: null,
    };
  default:
    return state;
  }
}
