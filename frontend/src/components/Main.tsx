import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Catalog from "./customers/Catalog";
import Basket from "./customers/Basket";
import History from "./customers/History";
import Account from "./customers/Account";

import {useDispatch, useSelector} from 'react-redux'
import { fetchDatabase } from "../store/actions/database";
import Login from "./Login";
import { CustomerRegister } from "./Register";
import Dishes from "./companies/Dishes";
import Orders from "./companies/Orders";
import Company from "./companies/Company";
import CompanyRegister from "./customers/CompanyRegister";


let customerRoutes = (
    <>
                <Route exact path='/catalog' component={Catalog}/>
                <Route path='/basket' component={Basket}/>
                <Route path='/history' component={History}/>
                <Route path='/account' component={Account}/>
                <Route path='/login' component={Login}/>
                <Route path='/company-register' component={CompanyRegister}/>
                <Route exact path='/'>
                    <Redirect to='/catalog'/>
                </Route>
                </>
)


let companyRoutes = (
    <>
                <Route exact path='/dishes' component={Dishes}/>
                <Route exact path='/orders' component={Orders}/>
                <Route exact path='/account' component={Company}/>
                <Route path='/login' component={Login}/>
                <Route exact path='/'>
                    <Redirect to='/dishes'/>
                </Route>
            </>
)


let anonRoutes = (
    <>
    <Route path='/login' component={Login}/>
    <Route path='/register' component={CustomerRegister}/>
        <Route exact path='/'>
            <Redirect to='/login'/>
        </Route>
    </>
)


function Main() {
    const dispatch = useDispatch()
    const uuu = useSelector((state: State) => state)
    const lll = useSelector((state: State) => state.loginStatus)

    React.useEffect(() => {
        dispatch(fetchDatabase())
    }, [dispatch]);
    // dispatch(fetchDatabase())
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
        <main>
          <Switch>
              {routes}
          </Switch>
        </main>
    )
}


export default Main;