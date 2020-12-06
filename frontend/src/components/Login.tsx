import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory, useLocation} from "react-router-dom";
import {customerLogin, logoutAction} from "../store/actions/loginStatus";


interface Props {
    logout: boolean
}


export default function Login({logout}: Props) {
    const [state, setState] = useState({
        username: "",
        password: "",
    });

    const hist = useHistory();
    const loginStatus = useSelector((state: State) => state.loginStatus)

    let {search} = useLocation();

    const query = new URLSearchParams(search);
    const needLogout = query.get('logout');

    function handleChange(event: any) {
        const {name, value} = event.target;
        setState({...state, [name]: value});
    }

    const dispatch = useDispatch()
    if (needLogout === "true") {
        dispatch(logoutAction())
    }

    async function login(event: any, useCompany: boolean) {
        event.preventDefault()
        await dispatch(customerLogin(state.username, state.password, useCompany))
        console.log("CHECKPOINT 2")
        console.log(loginStatus.accountType)
        hist.push("")
    }

    return (
        <div className="middle-login-page"
             style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <form className="inner-login-page" onSubmit={(event) => login(event, false)}
                  style={{fontSize: '14pt', marginBottom: '10px', width: "600px", height: "350px"}} >
                <h1>GetToFood</h1>
                <h3>Электронная почта</h3>
                <input className="account-text-input" type="text" name="username" value={state.username}
                       onChange={handleChange}/>
                <h3>Пароль</h3>
                <input className="account-text-input" type="password" name="password" value={state.password}
                       onChange={handleChange}/>
                <button type="submit">Войти</button>
                <Link to="/register/customer">
                    Регистрация
                </Link>
                <button type="button" onClick={(event) => login(event, true)}>Войти как компания</button>
            </form>
        </div>
    );
};