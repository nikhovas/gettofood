import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import backend from "../utils/backend";
import {useDispatch} from "react-redux";


interface IFormInput {
  name: string
  surname: string
  email: string
  phone: string
  password: string
  repeatPassword: string
}


export function CustomerRegister() {
  const { register, handleSubmit } = useForm<IFormInput>();
    const history = useHistory()
    const dispatch = useDispatch()

    const onSubmit = async (data: IFormInput) => {
        if (data.password !== data.repeatPassword) {
            alert("Пароли не совпадают")
        }
        const response = await backend.post(dispatch, "/api/register/", {
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone,
            password: data.password
        }, false)
        if (response.ok) {
            history.push('/login');
        } else {
            alert("Ошибка")
        }
        console.log(data)
    };
  
    return (
        <div className="middle-register-page" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <form className="inner-register-page" style={{fontSize: '14pt', marginBottom: '10px', width: "600px"}} onSubmit={handleSubmit(onSubmit)}>
            <h1>GetToFood</h1>
            <h3>Имя</h3>
            <input className="account-text-input" name="name" ref={register} type="text"/>
            <h3>Фамилия</h3>
            <input className="account-text-input" name="surname" ref={register} type="text"/>
            <h3>Телефон</h3>
            <input className="account-text-input" name="phone" ref={register} type="text"/>
            <h3>Почта</h3>
            <input className="account-text-input" name="email" ref={register} type="text"/>
            <h3>Пароль</h3>
            <input className="account-text-input" name="password" ref={register} type="password"/>
            <h3>Повторите</h3>
            <input className="account-text-input" name="repeatPassword" ref={register} type="password"/>
            <button className="default-button">Зарегестрироваться</button>
        </form>
    </div>
    );
  }


export function CompanyRegister() {
  
    return (
        <div className="middle-register-page" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <form className="inner-register-page" action="login.html" style={{fontSize: '14pt', marginBottom: '10px', width: "600px"}}>
            <h1>GetToFood</h1>
            <h3>Название</h3>
            <input className="account-text-input" name="name" type="text"/>
            <h3>Местоположение</h3>
            <select className="select-css">
                <option>Долгопрудный</option>
                <option>Москва</option>
            </select>
            <select className="select-css" style={{marginTop: "5px"}}>
                <option>МФТИ</option>
                <option>Другое</option>
            </select>
            <h3>Телефон</h3>
            <input className="account-text-input" name="email" type="text"/>
            <h3>Почта</h3>
            <input className="account-text-input" name="phone" type="text"/>
            <h3>Пароль</h3>
            <input className="account-text-input" name="password" type="password"/>
            <h3>Повторите</h3>
            <input className="account-text-input" name="repeat" type="password"/>
            <button>Зарегестрироваться</button>
        </form>
    </div>
    );
  }
