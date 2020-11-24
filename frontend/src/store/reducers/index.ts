import { combineReducers } from 'redux'
import dish from './dish'
import basket from './basket'
import account from './account'
import database from './database'
import loginStatus from './loginStatus'
import company from './company'


export default combineReducers({ dish, basket, account, database, loginStatus, company })