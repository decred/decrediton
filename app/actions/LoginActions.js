import { client } from './client';
export const LOGIN = 'LOGIN';
export const SET_CLIENT = 'SET_CLIENT';

export function login() {
    return {
        type: LOGIN
    };
}

export function setClient(grpcClient) {
    return {
        client: grpcClient,
        type: SET_CLIENT
    };
}

export function getClient() {
    return (dispatch: Function, getState: Function) => {
        const { address, port } = getState();
        var grpcClient = client(address, port);
        dispatch(setClient(grpcClient));
    };
}