// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import login from './login'
import grpc from './grpc'
//import walletLoader from './walletLoader'

const rootReducer = combineReducers({
  login,
  grpc,
  //walletLoader,
  routing
})

export default rootReducer
