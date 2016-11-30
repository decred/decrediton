import { client, getBalance } from '../middleware/grpc/client';

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
        var grpcClient = client(address, port);
        dispatch(setClient(grpcClient));
    };
}