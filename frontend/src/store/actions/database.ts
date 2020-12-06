import {Dispatch} from 'redux'
import backend from '../../utils/backend'


export const DATABASE_FETCH = 'DATABASE_FETCH'
export const DATABASE_FETCH_SUCCESS = 'DATABASE_FETCH_SUCCESS'
export const DATABASE_FETCH_ERROR = 'DATABASE_FETCH_ERROR'


function databaseFetchSuccess(shops: any) {
  return {
    type: DATABASE_FETCH_SUCCESS,
    payload: shops
  }
}

function databaseFetch() {
  return {
    type: DATABASE_FETCH,
  }
}

function databaseFetchError() {
  return {
    type: DATABASE_FETCH_ERROR
  }
}

export function fetchDatabase() {
  return async (dispatch: Dispatch) => {
      try {
        dispatch(databaseFetch())
        // const response = await backend.get("/api/shops-database")
        const response = await backend.get(dispatch, "/api/shops-database", false)
        // const response = await fetch(localStorage.getItem('backend_url') + "/api/shops-database", {
        //   headers: {
        //     "Content-Type": "Application/json",
        //     "Authorization": "Bearer " + String(localStorage.getItem("token"))
        //   },
        // });
        if (!response.ok) {
          return dispatch(databaseFetchError())
        }
        let shops = await response.json()
        dispatch(databaseFetchSuccess(shops))
      } catch(err) {
        dispatch(databaseFetchError())
      }
    }
}