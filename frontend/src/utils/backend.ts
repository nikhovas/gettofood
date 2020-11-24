function backendCoreRequest(url: string, method: string, body: any): Promise<Response> {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "Application/json",
            "Authorization": "Bearer " + String(localStorage.getItem("token"))
        },
        body: JSON.stringify(body)
    })
}


function backendCoreNoAuth(url: string, method: string, body: any): Promise<Response> {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(body)
    })
}


async function backendRequest(url: string, method: string, body: any, useAuth: boolean): Promise<Response> {
    let response = await (useAuth ? backendCoreRequest(url, method, body) : backendCoreNoAuth(url, method, body))

    if (!useAuth) {
        return response
    }

    if (response.ok) {
        return response
    }
    if (response.status === 401) {
        console.log("NOT OK RESP 3")
        let refreshResponse = await backendCoreRequest("/api/token/refresh/", "POST", {
            "refresh": String(localStorage.getItem("refresh"))
        })
        if (!refreshResponse.ok) {
            console.log("NOT OK RESP 2")
            return response
        }
        const json = await refreshResponse.json()
        console.log("UUUUUYYYYYYY")
        console.log(json)
        localStorage.setItem('token', json['access'])
        return backendCoreRequest(url, method, body)
    }
    return response
}


const backend = {
    request: backendRequest,

    patch: function(url: string, body: any, useAuth: boolean = true) {
        return backendRequest(url, "PATCH", body, useAuth)
    },
    post: function(url: string, body: any, useAuth: boolean = true) {
        return backendRequest(url, "POST", body, useAuth)
    },
    delete: function(url: string, useAuth: boolean = true) {
        return backendRequest(url, "DELETE", undefined, useAuth)
    },
    get: function(url: string, useAuth: boolean = true) {
        return backendRequest(url, "GET", undefined, useAuth)
    }
}


export default backend