import {LOGIN_FETCH, LOGIN_FETCH_ERROR, LOGIN_FETCH_SUCCESS, LOGIN_LOGOUT} from '../actions/loginStatus'


const initialState: State['loginStatus'] = JSON.parse(localStorage.getItem("loginStatus") || "{}")


export default function loginStatus(state = initialState, action: any) {
    
    switch(action.type) {
        case LOGIN_FETCH_SUCCESS:
            const status = {
                token: action.token,
                refresh: action.refresh,
                companyAllow: action.companyAllow,
                accountId: action.accountId,
                accountType: action.accountType,
                companyId: action.companyId
            }

            window.localStorage.setItem("loginStatus", JSON.stringify(status));
            return status
        case LOGIN_FETCH:
        case LOGIN_FETCH_ERROR:
        case LOGIN_LOGOUT:
            window.localStorage.setItem("loginStatus", JSON.stringify({
                accountType: "none"
            }));
            return {
                accountType: "none"
            }
    }

    return state
}