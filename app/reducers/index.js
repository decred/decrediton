// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { createForms } from 'react-redux-form';

const initialUserState = {
  address: "",
  port: "",
  passphrase: "",
};


const rootReducer = combineReducers({
  ...createForms({
    user: initialUserState,
  }),
  routing
});

export default rootReducer;
