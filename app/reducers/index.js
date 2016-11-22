// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { createForms } from 'react-redux-form/immutable';
import Immutable from 'immutable';


const initialUserState = Immutable.fromJS({
  address: "",
  port: "",
  passphrase: "",
  client: null,
  isloggedin: false,
});

const rootReducer = combineReducers({
  ...createForms({
    user: initialUserState,
  }),
  routing
});

export default rootReducer;
