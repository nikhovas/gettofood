import {Dispatch} from 'redux'
import backend from '../../utils/backend'


export const BASKET_FETCH = 'BASKET_FETCH'
export const BASKET_FETCH_SUCCESS = 'BASKET_FETCH_SUCCESS'
export const BASKET_FETCH_ERROR = 'BASKET_FETCH_ERROR'
export const BASKET_CHANGE_ELEMENT = 'BASKET_NEXT_COMPANY_STATUS'


function basketFetchSuccess(basket: any) {
    return {
        type: BASKET_FETCH_SUCCESS,
        payload: basket
    }
}

function basketFetch() {
    return {
        type: BASKET_FETCH,
    }
}

function basketFetchError() {
    return {
        type: BASKET_FETCH_ERROR
    }
}

function basketUpdate(item: ClientOrder, orderId: number, orders: ClientOrder[]) {
    return {
        type: BASKET_CHANGE_ELEMENT,
        id: orderId,
        item: item,
        payload: orders
    }
}

export function fetchBasket() {
    return async (dispatch: Dispatch) => {
        let dishes;
        try {

            dispatch(basketFetch())
            console.log("asdfds")
            const response = await backend.get("/api/orders/?account-type=client&extend=shop")

            console.log("fasdf")
            dishes = await response.json()


            dispatch(basketFetchSuccess(dishes))

        } catch (err) {
            dispatch(basketFetchError())
        }
    }
}


export function updateBasket(items: any) {
    return async (dispatch: Dispatch) => {
        dispatch(basketFetchSuccess(items))
    }

}


export function fetchCompanyBasket() {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(basketFetch())
            const response = await backend.get("/api/orders/?account-type=company&extend=client")
            let orders = await response.json();
            orders = orders.filter((elem: ClientOrder) => elem.status === "QD" || elem.status === "CG" || elem.status === "RY")
            dispatch(basketFetchSuccess(orders))
        } catch (err) {
            dispatch(basketFetchError())
        }
    }
}


export function updateBasketElement(orderId: number, data: any) {
    return async (dispatch: Dispatch, getState: any) => {
        try {
            const orders = getState().basket.orders
            dispatch(basketFetch())
            const response = await backend.patch(`/api/orders/${orderId}?extend=client`, data)
            const order = await response.json();
            dispatch(basketUpdate(order, orderId, orders))
        } catch (err) {
            dispatch(basketFetchError())
        }
    }
}