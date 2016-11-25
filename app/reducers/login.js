const login = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                address: action.address,
                port: action.port,
                passphrase: action.passphrase,
                loggedIn: true,
                grpcClient: action.client
            }
        default:
            return state
    }
}

export default login