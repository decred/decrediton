import { client, getBalance } from './client';
export const LOGIN = 'LOGIN';
export const SET_CLIENT = 'SET_CLIENT';

export const login = (address, port, passphrase) => ({
    address: address,
    port: port,
    passphrase: passphrase,
    type: LOGIN
})

export function setClient(grpcClient) {
    console.log("trying to set client!")
    return {
        client: grpcClient,
        type: SET_CLIENT
    };
}

export function getClient() {
    return (dispatch: Function, getState: Function) => {
        const { address, port } = getState().login;
        console.log(address, port);
        var grpcClient = client(address, port);
        getBalance(grpcClient);
        dispatch(setClient(grpcClient));
    };
}