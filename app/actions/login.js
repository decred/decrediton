// @flow
export const SET_WALLET_PORT = 'SET_WALLET_PORT';
export const SET_WALLET_ADDRESS = 'SET_WALLET_ADDRESS';
export const SET_WALLET_PASSPHRASE = 'SET_WALLET_PASSPHRASE';

export const GET_WALLET_PORT = 'GET_WALLET_PORT';
export const GET_WALLET_ADDRESS = 'GET_WALLET_ADDRESS';
export const GET_WALLET_PASSPHRASE = 'GET_WALLET_PASSPHRASE';


export const fetchWalletW() {
    return (getState: Function) => {
        setTimeout(() => {
            dispatch(      
                type: GET_WALLET_PORT,
                payload: port);
        }, delay);
    };
}

export function updateWalletAddress(address) {
    return (dispatch: Function) => {
        setTimeout(() => {
            dispatch(      
                type: WALLET_ADDRESS,
                payload: address);
        }, delay);
    };
}

export function updateWalletPort(port) {
    return (dispatch: Function) => {
        setTimeout(() => {
            dispatch(      
                type: WALLET_PORT,
                payload: port);
        }, delay);
    };
}

export function updateWalletPassphrase(passphrase) {
    return (dispatch: Function) => {
        setTimeout(() => {
            dispatch(      
                type: WALLET_PASSPHRASE,
                payload: passphrase);
        }, delay);
    };
}

export function getWalletInfo() {
    return (dispatch: Function, getState: Function) => {
        const { walletInfo } = getState().walletInfo;
        return
    };
}