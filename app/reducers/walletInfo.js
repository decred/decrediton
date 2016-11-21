// @flow
import { WALLET_PASSPHRASE, WALLET_PORT } from '../actions/login';

export default function walletInfo(state: loginInfo = {}, action) {
    switch (action.type) {
        case WALLET_PASSPHRASE:
            state = {...state, passphrase: action.payload};
            break;
        case WALLET_PORT:
            state = {...state, port: action.payload};
            break;
        default:
            return state;
    }
    return state;
}