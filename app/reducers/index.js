// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import login from './login'
import grpc from './grpc'
import walletLoader from './walletLoader'
import seedService from './seedService'
import notifications from './notifications'
import control from './control'

const rootReducer = combineReducers({
  login,
  grpc,
  walletLoader,
  seedService,
  notifications,
  control,
  routing
})

export default rootReducer
