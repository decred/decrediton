import {
  TRZ_LOADDEVICELIST_ATTEMPT, TRZ_LOADDEVICELIST_FAILED, TRZ_LOADDEVICELIST_SUCCESS,
  TRZ_DEVICELISTTRANSPORT_LOST,
  TRZ_SELECTEDDEVICE_CHANGED,
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
  default:
    return state;
  }
}
