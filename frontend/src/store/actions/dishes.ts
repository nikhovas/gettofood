import {Dispatch} from 'redux'
import backend from '../../utils/backend'
// import {postsNormalize} from '../schema/posts'

export const DISHES_FETCH = 'DISHES_FETCH'
export const DISHES_FETCH_SUCCESS = 'DISHES_FETCH_SUCCESS'
export const DISHES_FETCH_ERROR = 'DISHES_FETCH_ERROR'

function dishesFetchSuccess(dishes: any, currentShopId: number) {
  return {
    type: DISHES_FETCH_SUCCESS,
    payload: dishes,
    currentShopId: Number(currentShopId)
  }
}

function dishesFetch() {
  return {
    type: DISHES_FETCH,
  }
}

function dishesFetchError() {
  return {
    type: DISHES_FETCH_ERROR
  }
}

export function fetchDishes(shopId: number) {
  return async (dispatch: Dispatch) => {
      let dishes;

      try {

        dispatch(dishesFetch())
        const response = await backend.get("/api/dishes/?shop=" + shopId)
        dishes = await response.json()

        dispatch(dishesFetchSuccess(dishes, shopId))

      } catch(err) {
        dispatch(dishesFetchError())
      }
    }
}


export function fetchCompanyDishes() {
  return async (dispatch: Dispatch) => {
      let dishes;

      try {
        dispatch(dishesFetch())
        console.log("asdfds")
        const response = await backend.get("/api/dishes?account-type=company")
        console.log("fasdf")
        dishes = await response.json()

        dispatch(dishesFetchSuccess(dishes, 0))

      } catch(err) {
        dispatch(dishesFetchError())
      }
    }
}