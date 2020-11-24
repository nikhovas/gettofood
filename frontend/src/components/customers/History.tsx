import React from "react";
import Header from "../Header";
import {useDispatch, useSelector} from 'react-redux'
import { fetchBasket } from "../../store/actions/basket";


interface OrderItemData {
    count: number
    id: number
    dish: {
        name: string
        price: number
        id: number
    }
}


interface Shop {
    id: number
    name: string
    city: number
}


interface ShopOrderData {
    city: string
    shop: Shop
    order_items: OrderItemData[]
    id: number
    status: string
}


function SetShopOrderItem(props: {data: OrderItemData}) {
    let data = props.data
    return (
        <div className="basket-item">
            <div className="item-txt">{data.dish.name} x {data.count}</div>
        </div>
    )
}


function SetShopOrder(props: {data: ShopOrderData}) {
    let data = props.data
    let status_info
    switch (data.status) {
        case "RY":
            status_info = <div className="right" style={{ backgroundColor: '#43A047' }}>Ожидает</div>
            break;
        case "CG":
            status_info = <div className="right" style={{ backgroundColor: '#43A047' }}>Готовится</div>
            break;
        case "QD":
            status_info = <div className="right" style={{ backgroundColor: '#43A047' }}>В очереди</div>
            break;
        case "OK":
            status_info = <div className="right" style={{ backgroundColor: '#1B5E20' }}>Выполнено</div>
            break;
        case "CD":
            status_info = <div className="right" style={{ backgroundColor: '#e53935' }}>Отозвано</div>
            break;
        default:
            break;
    }
    console.log("iiu")
    console.log(data)

    let totalPrice = 0;
    for (let i of data.order_items) {
        totalPrice += i.dish.price * i.count
    }
    
    return (
        <div className="shop-item" style={{ marginTop: '40px' }}>
            <div style={{ fontSize: '14pt', marginBottom: '10px' }} className="shop-order-description">
                <div className="left">{data.shop.name}</div>
                {status_info}
                <div className="right">{totalPrice}р</div>
            </div>
            <div className="simple-elements">
                {data.order_items.map((elem: any) => (
                    <SetShopOrderItem data={elem}/>
                ))}
            </div>
        </div>
    )
}


function OrderSet(props: {data: ShopOrderData[]}) {
    
    
    return (
        <>
            {props.data.map(elem => (
                <SetShopOrder data={elem}/>
            ))}
        </>
    )
}


function History() {
    document.title = "Заказы"

    const dispatch = useDispatch()
    const basket = useSelector((state: State) => state.basket)

    React.useEffect(() => {
        dispatch(fetchBasket())
    }, [dispatch]);

    if (basket.isLoading) {
        return <div className="loader">Loading...</div>
        }

      console.log(basket.orders)

      let active = basket.orders.filter(elem => elem['status'] === 'QD' || elem['status'] === 'CG' || elem['status'] === 'RY')
      let completed = basket.orders.filter(elem => elem['status'] === 'OK' || elem['status'] === 'CD')

    return (
        <><Header current='history'  accountType="customer" />
            <div className="Basket">
                <div className="main">
                    <OrderSet data={active}/>
                    <h1 style={{ marginTop: '40px' }}>История</h1>
                    <OrderSet data={completed}/>
                </div>
            </div></>
    )
}


export default History;