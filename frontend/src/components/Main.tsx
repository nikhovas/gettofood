import React from "react";
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Catalog from "./customers/Catalog";
import Basket from "./customers/Basket";
import History from "./customers/History";
import Account from "./customers/Account";

import {useDispatch, useSelector} from 'react-redux'
import {fetchDatabase} from "../store/actions/database";
import Login from "./Login";
import {CustomerRegister} from "./Register";
import Dishes from "./companies/Dishes";
import Orders from "./companies/Orders";
import Company from "./companies/Company";
import CompanyRegister from "./customers/CompanyRegister";
import {logoutAction} from "../store/actions/loginStatus";


let customerRoutes = (
    <Switch>
        <Route exact path='/catalog' component={Catalog}/>
        <Route path='/basket' component={Basket}/>
        <Route path='/history' component={History}/>
        <Route path='/account' component={Account}/>
        <Route path='/login' component={Login}/>
        <Route path='/company-register' component={CompanyRegister}/>
        <Redirect from='' to='/catalog'/>
    </Switch>
)


let companyRoutes = (
    <Switch>
        <Route exact path='/dishes' component={Dishes}/>
        <Route exact path='/orders' component={Orders}/>
        <Route exact path='/account' component={Company}/>
        <Route path='/login' component={Login}/>
        <Redirect from='' to='/dishes'/>
    </Switch>
)


let anonRoutes = (
    <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={CustomerRegister}/>
        <Redirect from='' to='/login'/>
    </Switch>
)


function Main() {
    let links: any;
    const dispatch = useDispatch()
    const uuu = useSelector((state: State) => state)
    const lll = useSelector((state: State) => state.loginStatus)

    const logout = function (event: any) {
        dispatch(logoutAction())
    }

    if (lll.accountType === "customer") {
        links = (
            <>
                <NavLink to="/catalog" activeClassName="active">Выбор</NavLink>
                <NavLink to="/basket" activeClassName="active">Корзина</NavLink>
                <NavLink to="/history" activeClassName="active">Заказы</NavLink>
                <NavLink to="/login" activeClassName="active" style={{float: "right"}} onClick={logout}>Выход</NavLink>
                <NavLink to="/account" activeClassName="active" style={{float: "right"}}>Аккаунт</NavLink>
            </>
        )
    } else if (lll.accountType === "company") {
        links = (
            <>
                <NavLink to="/dishes" activeClassName="active">Блюда</NavLink>
                <NavLink to="/orders" activeClassName="active">Заказы</NavLink>
                <NavLink to="/login" activeClassName="active" style={{float: "right"}} onClick={logout}>Выход</NavLink>
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


    React.useEffect(() => {
        dispatch(fetchDatabase())
    }, [dispatch]);
    if (uuu.database.isLoading) {
        return <div>Loading...</div>
    }

    let routes;
    if (lll.accountType === "customer") {
        routes = customerRoutes
    } else if (lll.accountType === "company") {
        routes = companyRoutes
    } else {
        routes = anonRoutes
    }

    return (
        <>
            <div className="navigation-bar" id="myTopnav">
                <div className="site-title">GetToFood</div>
                {links}
            </div>
            {routes}
        </>
    )
}


export default Main;