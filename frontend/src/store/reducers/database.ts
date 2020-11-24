import {DATABASE_FETCH_SUCCESS, DATABASE_FETCH, DATABASE_FETCH_ERROR} from '../actions/database'


const initialState: State['database'] = {
    database: {
        cities: [],
        shops: []
    },
    isLoading: false,
    isError: false
}


export default function database(state = initialState, action: any) {
    
    switch(action.type) {
        case DATABASE_FETCH_SUCCESS:
        return {
            database: action.payload,
            isLoading: false,
            isError: false
        }
        case DATABASE_FETCH: 
        return {
            isLoading: true,
            isError: false
        }
        case DATABASE_FETCH_ERROR:
        return {
            isError: true,
            isLoading: false
        }
    }

    return state
}