import {
  LDG_WALLET_CLOSED,
  LDG_LEDGER_ENABLED,
  LDG_LEDGER_DISABLED,
  LDG_CONNECT_ATTEMPT,
  LDG_CONNECT_FAILED,
  LDG_CONNECT_SUCCESS,
  LDG_NOCONNECTEDDEVICE,
  LDG_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT,
  LDG_GETWALLETCREATIONMASTERPUBKEY_FAILED,
  LDG_GETWALLETCREATIONMASTERPUBKEY_SUCCESS
} from "actions/LedgerActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";

export default function ledger(state = {}, action) {
  switch (action.type) {
    case LDG_LEDGER_ENABLED:
      return { ...state, enabled: true };
    case LDG_LEDGER_DISABLED:
      return { ...state, enabled: false };
    case LDG_CONNECT_ATTEMPT:
      return {
        ...state,
        connectAttempt: true
      };
    case LDG_CONNECT_SUCCESS:
      return {
        ...state,
        // Ledger does not keep a constant connection. Device is set to true on
        // the first successful attempt and left true until the wallet is closed.
        device: true,
        connectAttempt: false
      };
    case LDG_CONNECT_FAILED:
      return {
        ...state,
        connectError: action.error,
        connectAttempt: false
      };
    case LDG_NOCONNECTEDDEVICE:
      // We don't currently listen for reconnect so not deleting the device.
      return {
        ...state
      };
    case LDG_WALLET_CLOSED:
      return {
        ...state,
        device: false,
        connected: false
      };
    case LDG_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT:
      return { ...state, walletCreationMasterPubkeyAttempt: true };
    case LDG_GETWALLETCREATIONMASTERPUBKEY_SUCCESS:
    case LDG_GETWALLETCREATIONMASTERPUBKEY_FAILED:
      return { ...state, walletCreationMasterPubkeyAttempt: false };
    case CLOSEWALLET_SUCCESS:
      return { ...state, enabled: false };
    default:
      return state;
  }
}
