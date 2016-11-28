// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import login from './login'
import home from './home'

const rootReducer = combineReducers({
  login,
  home,
  routing
})

export default rootReducer
