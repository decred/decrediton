// @flow
export const WALLET_PORT = 'WALLET_PORT';
export const WALLET_PASSPHRASE = 'WALLET_PASSPHRASE';

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
        dispatch(increment());
    };
}