import { TRANSACTIONNTFNS_START, TRANSACTIONNTFNS_FAILED, TRANSACTIONNTFNS_END, } from "../actions/NotificationActions";
import { ACCOUNTNTFNS_START, ACCOUNTNTFNS_DATA, ACCOUNTNTFNS_END } from "../actions/NotificationActions";
import { CLEARUNMINEDMESSAGE }  from "../actions/NotificationActions";

export default function notifications(state = {}, action) {
  switch (action.type) {
  case TRANSACTIONNTFNS_START:
    return { ...state,
      transactionNtfns: action.transactionNtfns,
      transactionNtfnsError: null,
    };
  case TRANSACTIONNTFNS_FAILED:
    return { ...state,
      transactionNtfns: null,
      transactionNtfnsError: action.error,
    };
  case TRANSACTIONNTFNS_END:
    return { ...state,
      transactionNtfns: null,
      transactionNtfnsError: null,
    };
  case ACCOUNTNTFNS_START:
    return { ...state,
      accountNtfns: action.accountNtfns,
    };
  case ACCOUNTNTFNS_DATA:
    return { ...state,
      accountNtfnsResponse: action.response,
    };
  case ACCOUNTNTFNS_END:
    return { ...state,
      accountNtfns: action.null,
    };
  case CLEARUNMINEDMESSAGE:
    return { ...state,
      newUnminedMessage: null,
    };
  default:
    return state;
  }
}
