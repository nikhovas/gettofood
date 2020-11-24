import {LOGIN_FETCH, LOGIN_FETCH_ERROR, LOGIN_FETCH_SUCCESS, LOGIN_LOGOUT} from '../actions/loginStatus'


// localStorage.setItem('accountType', action.accountType)
//         localStorage.setItem('token', action.token)


const initialState: State['loginStatus'] = {
    companyAllow: Boolean(localStorage.getItem('companyAllow')),
    token: String(localStorage.getItem('token')),
    refresh: String(localStorage.getItem('refresh')),
    accountId: Number(localStorage.getItem('accountId')),
    accountType: String(localStorage.getItem('accountType')),
    companyId: Number(localStorage.getItem('companyId'))
}


export default function loginStatus(state = initialState, action: any) {
    
    switch(action.type) {
        case LOGIN_FETCH_SUCCESS:
            console.log("QWERTY")
            localStorage.setItem('companyAllow', action.companyAllow)
            localStorage.setItem('token', action.token)
            localStorage.setItem('refresh', action.refresh)
            localStorage.setItem('accountId', action.accountId)
            localStorage.setItem('accountType', action.accountType)
            localStorage.setItem('companyId', action.companyId)
            return {
                token: action.token,
                refresh: action.refresh,
                companyAllow: action.companyAllow,
                accountId: action.accountId,
                accountType: action.accountType,
                companyId: action.companyId
            }
        case LOGIN_FETCH: 
            return {
                accountType: "none"
            }
        case LOGIN_FETCH_ERROR:
            return {
                accountType: "none"
            }
        case LOGIN_LOGOUT:
            localStorage.removeItem('companyAllow')
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            localStorage.removeItem('accountId')
            localStorage.removeItem('accountType')
            return {
                accountType: "none"
            }
    }

    return state
}