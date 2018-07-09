import {
  TRZ_LOADDEVICELIST_ATTEMPT, TRZ_LOADDEVICELIST_FAILED, TRZ_LOADDEVICELIST_SUCCESS,
  TRZ_DEVICELISTTRANSPORT_LOST,
  TRZ_SELECTEDDEVICE_CHANGED,
  TRZ_PIN_REQUESTED, TRZ_PIN_ENTERED, TRZ_PIN_CANCELED,
  TRZ_PASSPHRASE_REQUESTED, TRZ_PASSPHRASE_ENTERED, TRZ_PASSPHRASE_CANCELED,
  TRZ_CANCELOPERATION_SUCCESS,
} from "actions/TrezorActions";

export default function trezor(state = {}, action) {
  switch (action.type) {
  case TRZ_LOADDEVICELIST_ATTEMPT:
    return { ...state,
      deviceList: null,
      transportError: false,
      device: null,
    };
  case TRZ_LOADDEVICELIST_SUCCESS:
    return { ...state,
      deviceList: action.deviceList,
      transportError: false,
    };
  case TRZ_LOADDEVICELIST_FAILED:
    return { ...state,
      transportError: action.error,
    };
  case TRZ_DEVICELISTTRANSPORT_LOST:
    return { ...state,
      deviceList: null,
      transportError: action.error,
      device: null,
    };
  case TRZ_SELECTEDDEVICE_CHANGED:
    return { ...state,
      device: action.device,
    };
  case TRZ_PIN_REQUESTED:
    return { ...state,
      waitingForPin: true,
      pinCallBack: action.pinCallBack,
      pinMessage: action.pinMessage,
    };
  case TRZ_PIN_CANCELED:
  case TRZ_PIN_ENTERED:
    return { ...state,
      waitingForPin: false,
      pinCallBack: null,
      pinMessage: null,
    };
  case TRZ_PASSPHRASE_REQUESTED:
    return { ...state,
      waitingForPassPhrase: true,
      passPhraseCallBack: action.passPhraseCallBack,
    };
  case TRZ_PASSPHRASE_CANCELED:
  case TRZ_PASSPHRASE_ENTERED:
    return { ...state,
      waitingForPassPhrase: false,
      passPhraseCallBack: null,
    };
  case TRZ_CANCELOPERATION_SUCCESS:
    return { ...state,
      waitingForPin: false,
      pinCallBack: null,
      pinMessage: null,
      waitingForPassPhrase: false,
      passPhraseCallBack: null,
    };
  default:
    return state;
  }
}
