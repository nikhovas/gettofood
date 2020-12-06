import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import { fetchCompanyBasket, updateBasketElement } from "../../store/actions/basket";


interface SetShopOrderData {
    order: ClientOrder,
    onStatusChange: (status: string, orderId: number) => void
}


function SetShopOrder({order, onStatusChange}: SetShopOrderData) {
    let nextStatusText: string
    let nextStatusValue: string
    switch (order.status) {
        case "QD":
            nextStatusText = "В готовку"
            nextStatusValue = "CG"
            break
        case "CG":
            nextStatusText = "В выдачу"
            nextStatusValue = "RY"
            break
        case "RY":
            nextStatusText = "Готово"
            nextStatusValue = "OK"
            break
        default:
            nextStatusText = ""
            nextStatusText = ""
    }

    async function setNextStatus(event: any) {
        onStatusChange(nextStatusValue, order.id)
        event.preventDefault()
    }

    async function setCancelStatus(event: any) {
        onStatusChange("CD", order.id)
        event.preventDefault()
    }

    let totalPrice = 0;
    for (let i of order.order_items) {
        totalPrice += i.dish.price * i.count
    }
    
    return (
        <div className="shop-item" style={{marginTop: "40px"}}>
            <div style={{fontSize: "14pt", marginBottom: "10px"}} className="shop-order-description">
                <div className="left">{order.client.phone}</div>
                <div className="left">{order.client.name} {order.client.surname}</div>
                <div className="right" style={{backgroundColor: "#e53935"}} onClick={setCancelStatus}>Отказаться</div>
                <div className="right" style={{backgroundColor: "#43A047"}} onClick={setNextStatus}>{nextStatusText}</div>
                <div className="right">{totalPrice}р</div>
            </div>
            <div className="simple-elements">
                {order.order_items.map((elem: any) => (
                    <div className="basket-item">
                        <div className="item-txt">{elem.dish.name} x {elem.count}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}


function Orders() {
    const dispatch = useDispatch()
    const orders = useSelector((state: State) => state.basket)

    React.useEffect(() => {
        dispatch(fetchCompanyBasket())
    }, [dispatch]);

    if (orders.isLoading) {
        return <div className="loader">Loading...</div>
    }

    async function onNextStatus(status: string, orderId: number) {
        dispatch(updateBasketElement(orderId, {status: status}))
    }

    if (orders.isLoading) {
        return <div className="loader">Loading...</div>
    }

    return (
        <>
            <div className="Basket">
                <div className="main">
                {orders.orders.map(elem => (
                    <SetShopOrder order={elem} key={elem.id} onStatusChange={onNextStatus}/>
                ))}
                </div>
            </div></>
    )
}


export default Orders;