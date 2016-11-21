// @flow
import { WALLET_PASSPHRASE, WALLET_PORT, WALLET_ADDRESS } from '../actions/login';

export default function reducer(state={
    passphrase: "",
    port: "",
    address: "",
}, action) {
    switch (action.type) {
        case WALLET_ADDRESS:
            return {...state, address: action.payload}
        case WALLET_PASSPHRASE:
            return {...state, passphrase: action.payload}
        case WALLET_PORT:
            return {...state, port: action.payload}
        default:
            return state;
    }
}