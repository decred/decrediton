import { LOGIN, SET_CLIENT } from '../actions/LoginActions';

const login = (state = {
    address: "", 
    port: "", 
    passphrase: "",
    loggedIn: false,
    grpcClient: null
    }, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                address: action.address,
                port: action.port,
                passphrase: action.passphrase,
                loggedIn: true,
            }
        case SET_CLIENT:
            return {
                client: action.client
            }
        default:
            return state
    }
}

export default login