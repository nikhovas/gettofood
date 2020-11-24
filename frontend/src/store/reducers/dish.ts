import {DISHES_FETCH_SUCCESS, DISHES_FETCH, DISHES_FETCH_ERROR} from '../actions/dishes'


const initialState: State['dish'] = {
    dishes: [],
    isLoading: false,
    isError: false,
    currentShopId: 0
}


export default function dish(state = initialState, action: any) {
    switch(action.type) {
        case DISHES_FETCH_SUCCESS:
        return {
            dishes: action.payload,
            isLoading: false,
            isError: false,
            currentShopId: 0
        }
        case DISHES_FETCH: 
        return {
            isLoading: true,
            isError: false
        }
        case DISHES_FETCH_ERROR:
        return {
            isError: true,
            isLoading: false
        }
    }

    return state
}