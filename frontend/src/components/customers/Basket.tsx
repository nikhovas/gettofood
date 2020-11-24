import React from "react"
import {useDispatch, useSelector} from 'react-redux'
import { fetchBasket } from "../../store/actions/basket";
import backend from "../../utils/backend";
import Header from "../Header";


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


class OrderItem extends React.Component<OrderItemProperties> {
    onCountChange: (itemId: number, count: number) => void

    state: {
        count: number
        id: number
        dish: {
            name: string
            price: number
            id: number
        }
    }

    constructor(props: OrderItemProperties) {
        super(props);
        this.state = props.orderItemData
        this.onCountChange = props.onCountChange
    }

    async plusItem(count: number) {
        this.state.count += count;

        if (this.state.count <= 0) {
            return await this.deleteItem();
        }

        await backend.patch("/api/order-items/" + this.state.id, {
            "count": this.state.count
        })

        this.onCountChange(this.state.id, this.state.count)
    }

    async deleteItem() {
        this.onCountChange(this.state.id, 0)
    }

    render() {
        return (
            <div className="basket-item" id={"basket-item-" + this.state.dish.id}>
                <div className="item-txt">{this.state.dish.name}</div>
                <button className="count-button" style={{ gridArea: 'button1', alignSelf: 'start' }} onClick={this.plusItem.bind(this, 1)}>
                    <span className="fa fa-plus"></span>
                </button>
                <button className="count-button" style={{ gridArea: 'button2', alignSelf: 'start' }} id={"basket-item-number-" + this.state.dish.id}>{this.state.count}</button>
                <button className="count-button" style={{ gridArea: 'button3' }} onClick={this.plusItem.bind(this, -1)}>
                    <span className="fa fa-minus"></span>
                </button>
                <button className="count-button" style={{ gridArea: 'button4' }} onClick={this.deleteItem.bind(this)}>
                    <span className="fa fa-trash"></span>
                </button>
            </div>
        )
    }
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
    onDelete: (shopId: number) => void
}


class ShopOrder extends React.Component<ShopOrderProperties> {
    state: ShopOrderData
    onDelete: () => void

    constructor(props: ShopOrderProperties) {
        super(props);
        this.state = props.shopOrder
        this.onDelete = props.onDelete.bind(this, this.state.id)
        console.log("ooo")
        console.log(this.state)
    }

    async countChangeHandler(orderItemId: number, count: number) {
        const items: OrderItemData[] = [];

        for (let i of this.state.order_items) {
            if (i.id !== orderItemId) {
                items.push(i)
            } else if (count !== 0) {
                i.count = count
                items.push(i)
            }
        }

        if (items.length === 0) {
            this.onDelete();
        } else if (count === 0) {
            await backend.delete("/api/order-items/" + orderItemId)
        }
        this.setState({ order_items: items })
    }

    async applyOrder() {
        await fetch(localStorage.getItem('backend_url') + "/api/orders/" + this.state.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "Application/json",
                "Authorization": "Bearer " + String(localStorage.getItem("token"))
            },
            body: JSON.stringify({
                "status": "QD"
            }),
        });
        this.onDelete();
    }

    render() {
        let totalPrice = 0;
        for (let i of this.state.order_items) {
            totalPrice += i.dish.price * i.count
        }
        return (
            <div className="shop-item" style={{ marginTop: '40px' }}>
                <div style={{ fontSize: '14pt', marginBottom: '10px' }} className="shop-order-description">
                    <div className="left">{this.state.shop.name}</div>
                    <div className="right">
                        <span className="fa fa-trash" onClick={this.onDelete}/>
                    </div>
                    <div className="right">
                        <span className="fa fa-shopping-basket" onClick={this.applyOrder.bind(this)}/>
                    </div>
                    <div className="right">{totalPrice}р</div>
                </div>
                <div className="simple-elements">
                    {this.state.order_items.map((elem: any) => (
                        <OrderItem orderItemData={elem} onCountChange={this.countChangeHandler.bind(this)} key={elem.id}/>
                    ))}
                </div>
            </div>
        )
    }
}


interface BasketOrdersData {
    orders: ClientOrder[]
}


interface BasketInternalProperties {
    orders: ClientOrder[]
}


class BasketInternal extends React.Component<BasketInternalProperties> {
    state: BasketOrdersData

    constructor(props: BasketInternalProperties) {
        super(props);
        this.state = {
            orders: props.orders
        }
        
    }

    async childDeleteHandler(orderId: number) {
        await fetch(localStorage.getItem('backend_url') + "/api/orders/" + orderId, {
            method: "DELETE",
            headers: {
                "Content-Type": "Application/json",
                "Authorization": "Bearer " + String(localStorage.getItem("token"))
            }
        })

        const items = this.state.orders.filter(order => order.id !== orderId);
        this.state.orders = items

        this.setState({ items: items });
    }

    render() {
        return (
            <><Header current='basket' accountType="customer" />
                <div className="Basket">
                    <div className="main">
                        {this.state.orders.map((elem) => (
                            <ShopOrder shopOrder={elem} onDelete={this.childDeleteHandler.bind(this)} key={elem.id}/>
                        ))}
                    </div>
                </div>
            </>
        )
    }
}


function Basket(props: ShopOrderProperties) {
    document.title = "Корзина"

    const dispatch = useDispatch()
        const basket = useSelector((state: State) => state.basket)

        React.useEffect(() => {
            dispatch(fetchBasket())
        }, [dispatch]);

        if (basket.isLoading) {
            return <div className="loader">Loading...</div>
        }

        let orders = basket.orders.filter(elem => elem['status'] === 'BT')
        
        return (
            <BasketInternal orders={orders}/>
        )
}


export default Basket;