import React from "react";
import { NavLink } from "react-router-dom";

type IProps = {
    current: string
    accountType: string
}

function Header({ accountType }: IProps) {
    let links: any;
    if (accountType === "customer") {
        links = (
            <>
                <NavLink to="/catalog" activeClassName="active">Выбор</NavLink>
                <NavLink to="/basket" activeClassName="active">Корзина</NavLink>
                <NavLink to="/history" activeClassName="active">Заказы</NavLink>
                <NavLink to="/login?logout=true" activeClassName="active" style={{float: "right"}}>Выход</NavLink>
        <NavLink to="/account" activeClassName="active" style={{float: "right"}}>Аккаунт</NavLink>
            </>
        )
    } else if (accountType === "company") {
        links = (
            <>
                <NavLink to="/dishes" activeClassName="active">Блюда</NavLink>
                <NavLink to="/orders" activeClassName="active">Заказы</NavLink>
                <NavLink to="/login?logout=true" activeClassName="active" style={{float: "right"}}>Выход</NavLink>
                <NavLink to="/account" activeClassName="active" style={{float: "right"}}>Компания</NavLink>
            </>
        )
    } else {
        links = (
            <>
                <NavLink to="/login" activeClassName="active" style={{float: "right"}}>Вход</NavLink>
            </>
        )
    }
    return (
        <div className="navigation-bar" id="myTopnav">
            <div className="site-title">GetToFood</div>
            {links}
        </div>
    )
}


export default Header;