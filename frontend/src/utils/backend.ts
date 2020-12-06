import {logoutAction} from "../store/actions/loginStatus";

function backendCoreRequest(dispatch: any, url: string, method: string, body: any): Promise<Response> {
    const loginStatus = JSON.parse(localStorage.getItem("loginStatus") || "{}")
    const token = loginStatus["token"]
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "Application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
    })
}


function backendCoreNoAuth(dispatch: any, url: string, method: string, body: any): Promise<Response> {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(body)
    })
}


async function backendRequest(dispatch: any, url: string, method: string, body: any, useAuth: boolean): Promise<Response> {
    let response = await (useAuth ? backendCoreRequest(dispatch, url, method, body) : backendCoreNoAuth(dispatch, url, method, body))

    if (!useAuth) {
        return response
    }

    if (response.ok) {
        return response
    }
    if (response.status === 401) {
        console.log("NOT OK RESP 3")
        let refreshResponse = await backendCoreRequest(dispatch, "/api/token/refresh/", "POST", {
            "refresh": String(localStorage.getItem("refresh"))
        })

        if (refreshResponse.status === 401) {
            await dispatch(logoutAction())
            return response
        } else if (!refreshResponse.ok) {
            console.log("NOT OK RESP 2")
            alert("Произошла ошибка. Перезагружите страницу.")
            return response
        }
        const json = await refreshResponse.json()
        console.log("UUUUUYYYYYYY")
        console.log(json)
        localStorage.setItem('token', json['access'])
        return backendCoreRequest(dispatch, url, method, body)
    }
    return response
}


const backend = {
    request: backendRequest,

    patch: function(dispatch: any, url: string, body: any, useAuth: boolean = true) {
        return backendRequest(dispatch, url, "PATCH", body, useAuth)
    },
    post: function(dispatch: any, url: string, body: any, useAuth: boolean = true) {
        return backendRequest(dispatch, url, "POST", body, useAuth)
    },
    delete: function(dispatch: any, url: string, useAuth: boolean = true) {
        return backendRequest(dispatch, url, "DELETE", undefined, useAuth)
    },
    get: function(dispatch: any, url: string, useAuth: boolean = true) {
        return backendRequest(dispatch, url, "GET", undefined, useAuth)
    }
}


export default backend