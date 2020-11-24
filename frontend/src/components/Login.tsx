import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { customerLogin, logoutAction } from "../store/actions/loginStatus";


interface Props {
  logout: boolean
}


export default function Login({logout}: Props) {
    const [state, setState] = useState({
      username: "",
      password: "",
    });

    const hist = useHistory();

    let { search } = useLocation();

    const query = new URLSearchParams(search);
    const needLogout = query.get('logout');
  
    function handleChange(event: any) {
      const { name, value } = event.target;
      setState({ ...state, [name]: value });
    }

    const dispatch = useDispatch()
    if (needLogout === "true") {
      dispatch(logoutAction())
    }
  
    async function login(useCompany: boolean) {
      console.log("HERE")
      dispatch(customerLogin(state.username, state.password, useCompany))
      if (useCompany) {
        hist.push("/dishes");
      } else {
        hist.push("/catalog");
      }
      
    }
  
    return (
      <div className="middle-login-page" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <form className="inner-login-page" style={{fontSize: '14pt', marginBottom: '10px', width: "600px", height: "350px"}}>
              <h1>GetToFood</h1>
              <h3>Телефон</h3>
              <input className="account-text-input" type="text" name="username" value={state.username} onChange={handleChange}/>
              <h3>Пароль</h3>
              <input className="account-text-input" type="password" name="password" value={state.password} onChange={handleChange}/>
              <button type="button" onClick={() => login(false)}>Войти</button>
              <Link to="/register/customer">
              Регистрация
                </Link>
              {/* <a href="registration.html">Регистрация</a> */}
              <button type="button" onClick={() => login(true)}>Войти как компания</button>
              {/* <a href="../companies/login.html">Вход для {isCustomer ? "компаний" : "клиентов"}</a> */}
          </form>
      </div>
    );
  };