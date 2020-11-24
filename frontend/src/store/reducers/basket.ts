import {BASKET_FETCH_SUCCESS, BASKET_FETCH, BASKET_FETCH_ERROR, BASKET_CHANGE_ELEMENT} from '../actions/basket'


const initialState: State['basket'] = {
    orders: [],
    isLoading: false,
    isError: false,
}


export default function basket(state = initialState, action: any) {
    
    switch(action.type) {
        case BASKET_FETCH_SUCCESS:
        return {
            orders: action.payload,
            isLoading: false,
            isError: false
        }
        case BASKET_FETCH: 
        return {
            orders: [],
            isLoading: true,
            isError: false
        }
        case BASKET_FETCH_ERROR:
        return {
            orders: [],
            isError: true,
            isLoading: false
        }
        case BASKET_CHANGE_ELEMENT:
            const orders: ClientOrder[] = [];
            for (const i of action.payload) {
                if (i.id === action.id) {
                    Object.assign(i, action.item)
                }
                if (i.status === "QD" || i.status === "CG" || i.status === "RY") {
                    orders.push(i)
                }
            }
            return {
                orders: orders,
                isLoading: false,
                isError: false
            }

    }

    return state
}