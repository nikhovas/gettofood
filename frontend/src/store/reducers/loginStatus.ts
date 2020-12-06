import {LOGIN_FETCH, LOGIN_FETCH_ERROR, LOGIN_FETCH_SUCCESS, LOGIN_LOGOUT} from '../actions/loginStatus'


// localStorage.setItem('accountType', action.accountType)
//         localStorage.setItem('token', action.token)


// const initialState: State['loginStatus'] = {
//     companyAllow: Boolean(localStorage.getItem('companyAllow')),
//     token: String(localStorage.getItem('token')),
//     refresh: String(localStorage.getItem('refresh')),
//     accountId: Number(localStorage.getItem('accountId')),
//     accountType: String(localStorage.getItem('accountType')),
//     companyId: Number(localStorage.getItem('companyId'))
// }


const initialState: State['loginStatus'] = JSON.parse(localStorage.getItem("loginStatus") || "{}")


export default function loginStatus(state = initialState, action: any) {
    
    switch(action.type) {
        case LOGIN_FETCH_SUCCESS:
            console.log("QWERTY")
            window.localStorage.setItem("loginStatus", JSON.stringify({
                token: action.token,
                refresh: action.refresh,
                companyAllow: action.companyAllow,
                accountId: action.accountId,
                accountType: action.accountType,
                companyId: action.companyId
            }));
            return {
                token: action.token,
                refresh: action.refresh,
                companyAllow: action.companyAllow,
                accountId: action.accountId,
                accountType: action.accountType,
                companyId: action.companyId
            }
        case LOGIN_FETCH:
            window.localStorage.setItem("loginStatus", JSON.stringify({
                accountType: "none"
            }));
            return {
                accountType: "none"
            }
        case LOGIN_FETCH_ERROR:
            window.localStorage.setItem("loginStatus", JSON.stringify({
                accountType: "none"
            }));
            return {
                accountType: "none"
            }
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