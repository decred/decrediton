const home = (state = {loggedIn:false}, action) => {
switch (action.type) {
    case 'LOGGED_IN':
        return state.loggedIn
    default:
        return state
    }
}

export default home