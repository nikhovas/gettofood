import {Dispatch} from 'redux'
import backend from '../../utils/backend'

export const COMPANY_FETCH = 'DCOMPANY_FETCH'
export const COMPANY_FETCH_SUCCESS = 'COMPANY_FETCH_SUCCESS'
export const COMPANY_FETCH_ERROR = 'COMPANY_FETCH_ERROR'

export function companyFetchSuccess(dishes: any) {
  return {
    type: COMPANY_FETCH_SUCCESS,
    payload: dishes
  }
}

function companyFetch() {
  return {
    type: COMPANY_FETCH,
  }
}

function companyFetchError() {
  return {
    type: COMPANY_FETCH_ERROR
  }
}

export function fetchCompany() {
  return async (dispatch: Dispatch) => {
      let dishes;
      const loginStatus = JSON.parse(localStorage.getItem("loginStatus") || "{}")
      try {
        dispatch(companyFetch())
        const response = await backend.get(dispatch, "/api/companies/" + loginStatus["companyId"])
        dishes = await response.json()

        dispatch(companyFetchSuccess(dishes))

      } catch(err) {
        dispatch(companyFetchError())
      }
    }
}


export function updateCompany(fieldName: string, fieldValue: any, companyId: number) {
    return async (dispatch: Dispatch) => {
        let dishes;
        try {
          dispatch(companyFetch())
          const response = await backend.patch(dispatch, "/api/companies/", {[fieldName]: fieldValue})
          dishes = await response.json()
          dispatch(companyFetchSuccess(dishes))
        } catch(err) {
          dispatch(companyFetchError())
        }
      }
  }