import React, {useState} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {fetchBasket, removeBasketElement} from "../../store/actions/basket";
import backend from "../../utils/backend";


interface OrderItemData {
    count: number
    id: number
    dish: {
        name: string
        price: number
        id: number
    }
}


interface OrderItemProperties {
    orderItemData: OrderItemData
    onCountChange: (itemId: number, count: number) => void
}


function OrderItem(props: OrderItemProperties) {
    const onCountChange = props.onCountChange
    const [state] = useState<OrderItemData>(props.orderItemData)
    const dispatch = useDispatch()

    const deleteItem = async function() {
        onCountChange(state.id, 0)
    }

    const plusItem = async function(count: number) {
        state.count += count;

        if (state.count <= 0) {
            return await deleteItem();
        }

        await backend.patch(dispatch, "/api/order-items/" + state.id, {
            "count": state.count
        })

        onCountChange(state.id, state.count)
    }

    return (
        <div className="basket-item" id={"basket-item-" + state.dish.id}>
            <div className="item-txt">{state.dish.name}</div>
            <button className="count-button" style={{ gridArea: 'button1', alignSelf: 'start' }} onClick={() => plusItem(1)}>
                <span className="fa fa-plus"></span>
            </button>
            <button className="count-button" style={{ gridArea: 'button2', alignSelf: 'start' }} id={"basket-item-number-" + state.dish.id}>{state.count}</button>
            <button className="count-button" style={{ gridArea: 'button3' }} onClick={() => plusItem(-1)}>
                <span className="fa fa-minus"></span>
            </button>
            <button className="count-button" style={{ gridArea: 'button4' }} onClick={deleteItem}>
                <span className="fa fa-trash"></span>
            </button>
        </div>
    )
}


interface Shop {
    id: number
    name: string
    city: number
}


interface ShopOrderData {
    city: string
    shopName: string
    shop: Shop
    order_items: OrderItemData[]
    id: number
}


interface ShopOrderProperties {
    shopOrder: ClientOrder
    onDelete: (shopId: number, realDelete: boolean) => void
}


function ShopOrder(props: ShopOrderProperties) {
    const [state, setState] = useState<ShopOrderData>(props.shopOrder)
    const onDelete = props.onDelete
    const dispatch = useDispatch()

    const countChangeHandler = async function (orderItemId: number, count: number) {
        const items: OrderItemData[] = [];

        for (let i of state.order_items) {
            if (i.id !== orderItemId) {
                items.push(i)
            } else if (count !== 0) {
                i.count = count
                items.push(i)
            }
        }

        if (items.length === 0) {
            onDelete(state.id, true);
        } else if (count === 0) {
            await backend.delete(dispatch, "/api/order-items/" + orderItemId)
        }
        setState({city: state.city, id: state.id, shop: state.shop, shopName: state.shopName, order_items: items })
    }

    const applyOrder = async function() {
        await backend.patch(dispatch, "/api/orders/" + state.id, {
            "status": "QD"
        })
        onDelete(state.id, false);
    }

    let totalPrice = 0;
    for (let i of state.order_items) {
        totalPrice += i.dish.price * i.count
    }

    return (
        <div className="shop-item" style={{ marginTop: '40px' }}>
            <div style={{ fontSize: '14pt', marginBottom: '10px' }} className="shop-order-description">
                <div className="left">{state.shop.name}</div>
                <div className="right">
                    <span className="fa fa-trash" onClick={() => onDelete(state.id, true)}/>
                </div>
                <div className="right">
                    <span className="fa fa-shopping-basket" onClick={applyOrder}/>
                </div>
                <div className="right">{totalPrice}р</div>
            </div>
            <div className="simple-elements">
                {state.order_items.map((elem: any) => (
                    <OrderItem orderItemData={elem} onCountChange={countChangeHandler} key={elem.id}/>
                ))}
            </div>
        </div>
    )
}


function Basket() {
    document.title = "Корзина"

    const dispatch = useDispatch()
    const basket = useSelector((state: State) => state.basket)
    let orders = basket.orders.filter(elem => elem['status'] === 'BT')

    const childDeleteHandler = async function(orderId: number, realDelete: boolean = true) {
        dispatch(removeBasketElement(orderId, realDelete))
    }

    React.useEffect(() => {
        dispatch(fetchBasket())
    }, [dispatch]);

    if (basket.isLoading) {
        return <div className="loader">Loading...</div>
    }

    return (
        <>
            <div className="Basket">
                <div className="main">
                    {orders.map((elem) => (
                        <ShopOrder shopOrder={elem} onDelete={childDeleteHandler} key={elem.id}/>
                    ))}
                </div>
            </div>
        </>
    )
}


export default Basket;