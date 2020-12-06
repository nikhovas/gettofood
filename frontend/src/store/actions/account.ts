import {Dispatch} from 'redux'
import backend from '../../utils/backend'
// import {postsNormalize} from '../schema/posts'

export const ACCOUNT_FETCH = 'ACCOUNT_FETCH'
export const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS'
export const ACCOUNT_FETCH_ERROR = 'ACCOUNT_FETCH_ERROR'

export function accountFetchSuccess(basket: any) {
  return {
    type: ACCOUNT_FETCH_SUCCESS,
    payload: basket
  }
}

function accountFetch() {
  return {
    type: ACCOUNT_FETCH,
  }
}

function accountFetchError() {
  return {
    type: ACCOUNT_FETCH_ERROR
  }
}

export function fetchAccount() {
  return async (dispatch: Dispatch) => {
      let dishes;

      try {
        dispatch(accountFetch())
        const response = await backend.get(dispatch, "/api/account/")
        dishes = await response.json()
        dispatch(accountFetchSuccess(dishes))
      } catch(err) {
        dispatch(accountFetchError())
      }
    }
}


export function updateAccount(fieldName: string, fieldValue: any) {
  return async (dispatch: Dispatch) => {
      let dishes;
      try {
        dispatch(accountFetch())
        const response = await backend.patch(dispatch, "/api/account/", {[fieldName]: fieldValue})
        dishes = await response.json()
        dispatch(accountFetchSuccess(dishes))
      } catch(err) {
        dispatch(accountFetchError())
      }
    }
}

export function setAccount(account: AccountData) {
  return async (dispatch: Dispatch) => {
      try {
        
        dispatch(accountFetchSuccess(account))
      } catch(err) {
        dispatch(accountFetchError())
      }
    }
}

export function changePasswordAccount(oldPassword: string, newPassword: string) {
  console.log(oldPassword)
  console.log(newPassword)
  return async (dispatch: Dispatch) => {
    let dishes;
    try {
      dispatch(accountFetch())
      const response = await backend.patch(dispatch, "/api/change-password/", {old_password: oldPassword, new_password: newPassword})
      dishes = await response.json()
      dispatch(accountFetchSuccess(dishes))
    } catch(err) {
      dispatch(accountFetchError())
    }
  }
}