import {ACCOUNT_FETCH_SUCCESS, ACCOUNT_FETCH, ACCOUNT_FETCH_ERROR} from '../actions/account'


const initialState: State['account'] = {
    data: {
        name: "",
        surname: "",
        phone: "",
        email: "" 
    },
    isLoading: false,
    isError: false,
}


export default function account(state = initialState, action: any) {
    
    switch(action.type) {
        case ACCOUNT_FETCH_SUCCESS:
        return {
            data: action.payload,
            isLoading: false,
            isError: false
        }
        case ACCOUNT_FETCH: 
        return {
            isLoading: true,
            isError: false
        }
        case ACCOUNT_FETCH_ERROR:
        return {
            isError: true,
            isLoading: false
        }
    }

    return state
}