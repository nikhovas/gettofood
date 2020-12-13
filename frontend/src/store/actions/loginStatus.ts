import {Dispatch} from 'redux'
import backend from '../../utils/backend'


export const LOGIN_FETCH = 'CUSTOMER_LOGIN_FETCH'
export const LOGIN_FETCH_ERROR = 'CUSTOMER_LOGIN_FETCH_ERROR'
export const LOGIN_FETCH_SUCCESS = 'CUSTOMER_LOGIN_FETCH_SUCCESS'
export const LOGIN_LOGOUT = 'LOGIN_LOGOUT'

export function createLoginStatus() {
    return {
        type: "hello"
    }
  
}

function customerLoginFetch() {
    return {
      type: LOGIN_FETCH,
    }
  }

  function customerLoginFetchError() {
    console.log("CHECKPOINT HERE")
    return {
      type: LOGIN_FETCH_ERROR,
    }
  }

  function loginLogout() {
    return {
      type: LOGIN_LOGOUT,
    }
  }

 function customerLoginFetchSuccess(data: {token: string, refresh: string, companyAllow: boolean, accountId: number, accountType: string, companyId: number}) {
    return {...data, type: LOGIN_FETCH_SUCCESS}
  }

export function customerLogin(login: string, password: string, useCompany: boolean) {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(customerLoginFetch())
            const response = await backend.post(dispatch, "/api/token/", {
                email: login,
                password: password
            }, false)

            if (!response.ok) {
              alert("Ошибка авторизации")
              dispatch(customerLoginFetchError())
              return
            }

            let data = await response.json()
            if (useCompany) {
                if (data['company'] === true) {
                    dispatch(customerLoginFetchSuccess({
                        token: data["access"],
                        refresh: data["refresh"],
                        companyAllow: data["company"],
                        accountId: data["accountId"],
                        accountType: "company",
                        companyId: data["companyId"]
                    }))
                } else {
                    dispatch(customerLoginFetchError())
                }
            } else {
                dispatch(customerLoginFetchSuccess({
                        token: data["access"],
                        refresh: data["refresh"],
                        companyAllow: data["company"],
                        accountId: data["accountId"],
                        accountType: "customer",
                        companyId: data["companyId"]
                    }))
            }
        } catch(err) {
          dispatch(customerLoginFetchError())
        }
    }
}


export function logoutAction() {
    return async (dispatch: Dispatch) => {
        dispatch(loginLogout())
    }
}