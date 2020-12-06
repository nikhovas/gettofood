import React, { useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { fetchDishes } from "../../store/actions/dishes";
import backend from '../../utils/backend'


function Dish(props: any) {
    let dishData = props.dishData
    const dispatch = useDispatch()

    async function onClick(event: any) {
        await backend.post(dispatch, "/api/order-items/", {
            "dish_id": dishData.id,
            "count": 1
        })
    }
    
    return (
        <div className="catalog-item">
            <div className="item-txt" style={{ gridArea: "text" }}>{dishData.name}</div>
            <button className="item-button" style={{ gridArea: "button" }} onClick={onClick}>
            <span className="fa fa-shopping-basket"/>
                {dishData.price}р
            </button>
        </div>
    )
}


interface SelectCatalogProperties {
    data: any[]
    currentId: number
    onChange: (id: number) => void
}


class SelectCatalog extends React.Component<SelectCatalogProperties> {
    state: SelectCatalogProperties

    constructor(props: SelectCatalogProperties) {
        super(props)
        this.state = props
    }

    render() {
        return <select className="select-css" onChange={(event: any) => {this.state.onChange(event.target.value)}} value={this.state.currentId}>
            {this.state.data.map((elem: any) => (
                <option value={elem.id}>{elem.name}</option>
            ))}
        </select>
    }

    componentWillReceiveProps(props: SelectCatalogProperties) {
        this.setState(props)
    }
}


const Catalog: React.FC = () => {
    document.title = "Каталог"

    const dispatch = useDispatch()
    const uuu = useSelector((state: State) => state)

    const [currentShop, setShop] = useState(uuu.dish.currentShopId);

    let initCity = 1;
    let yy = uuu.database.database.shops.filter(elem => String(elem.id) === String(currentShop))
    if (yy.length !== 0) {
        initCity = yy[0].city
    }

    const [currentCity, setCity] = useState(initCity);

    React.useEffect(() => {
        dispatch(fetchDishes(currentCity))
    }, [currentCity, dispatch]);

    if (uuu.dish.isLoading) {
        return <div className="loader">Loading...</div>
    }

    function onSubmit(event: any) {
        dispatch(fetchDishes(currentShop))
        event.preventDefault();
    }

    function changeCity(cityId: number) {
        const shopElements: any[] = uuu.database.database.shops.filter(elem => String(elem.city) === String(cityId))
        setCity(cityId)
        if (shopElements.length !== 0) {
            setShop(shopElements[0].id)
        } else {
            setShop(0)
        }
        
    }

    const shopElements: any[] = uuu.database.database.shops.filter(elem => String(elem.city) === String(currentCity))

    return (
        <>
            <div className="Catalog">
                <div className="grid-container">
                    <div className="item3">
                        <div className="simple-elements">
                            {uuu.dish.dishes.map((elem) => (
                                <Dish dishData={elem}/>
                            ))}
                        </div>
                    </div>
                    <div className="item4">
                        <form onSubmit={onSubmit}>
                        <div className="filter-description">Город</div>
                        <SelectCatalog data={uuu.database.database.cities} currentId={currentCity} onChange={changeCity}/>

                        <div className="filter-description">Заведение</div>
                        <SelectCatalog data={shopElements} currentId={currentShop} onChange={setShop}/>

                        <button type="submit">Найти</button>
                        </form>
                    </div>
                </div>
            </div></>
    )
    // return (<div>adsf</div>)
}


export default Catalog;