import {COMPANY_FETCH_SUCCESS, COMPANY_FETCH, COMPANY_FETCH_ERROR} from '../actions/company'


const initialState: State['company'] = {
    company: {
        name: "",
        city: 0,
        id: 0
    },
    isLoading: false,
    isError: false
}


export default function company(state = initialState, action: any) {
    switch(action.type) {
        case COMPANY_FETCH_SUCCESS:
        return {
            company: action.payload,
            isLoading: false,
            isError: false
        }
        case COMPANY_FETCH: 
        return {
            isLoading: true,
            isError: false
        }
        case COMPANY_FETCH_ERROR:
        return {
            isError: true,
            isLoading: false
        }
    }

    return state
}