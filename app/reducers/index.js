// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import login from './login'
import grpc from './grpc'

const rootReducer = combineReducers({
  login,
  grpc,
  routing
})

export default rootReducer
