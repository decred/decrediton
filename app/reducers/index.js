// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import login from './login'
import grpc from './grpc'
import walletLoader from './walletLoader'
import seedService from './seedService'

const rootReducer = combineReducers({
  login,
  grpc,
  walletLoader,
  seedService,
  routing
})

export default rootReducer
