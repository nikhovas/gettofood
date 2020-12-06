import React, { useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { fetchDishes } from "../../store/actions/dishes"
import { useHistory } from "react-router-dom"
import backend from "../../utils/backend"


function Dish(props: any) {

    const [editStatus, setEditStatus] = useState(false)
    const [dishName, setDishName] = useState(props.dishData.name)
    const [dishPrice, setDishPrice] = useState(props.dishData.price)
    const history = useHistory()
    const dispatch = useDispatch()

    async function handleNameChange(event: any) {
        setDishName(String(event.target.value))
    }

    async function handlePriceChange(event: any) {
        setDishPrice(Number(event.target.value))
    }

    async function onEditClick(event: any) {
        event.preventDefault()
        setEditStatus(true)
    }

    async function onSaveClick(event: any) {
        event.preventDefault()
        await backend.patch(dispatch, "/api/dishes/" + props.dishData.id, {
            "name": dishName,
            "price": dishPrice
        })

        setEditStatus(false)
    }

    async function onDeleteClick(event: any) {
        event.preventDefault()
        await backend.delete(dispatch, "/api/dishes/" + props.dishData.id)
        history.go(0);
    }
    
    return (
        <form className="dishes-item" onSubmit={onSaveClick}>
            <input style={{ gridArea: "name", margin: "0px", backgroundColor: "#333", borderWidth: "0px", color: "white", fontSize: 14 }} type="text" value={dishName} disabled={!editStatus} onChange={handleNameChange}/>
            <input style={{ gridArea: "cost", margin: "0px", backgroundColor: "#333", borderWidth: "0px", color: "white", fontSize: 14 }} type="number" value={dishPrice} disabled={!editStatus} onChange={handlePriceChange}/>
            {
                editStatus ?
                <button className="item-button" style={{ gridArea: "edit" }} type="submit"><span className="fa-floppy-o"></span></button> :
                <button className="item-button" style={{ gridArea: "edit" }} onClick={onEditClick}><span className="fa fa-pencil"></span></button>
                
            }
            
            <button className="item-button" style={{ gridArea: "delete" }} onClick={onDeleteClick}><span className="fa fa-trash-o"></span></button>
        </form>
    )
}


interface DishAddProps {
    shopId: number
}


function DishAdd(props: DishAddProps) {
    const [dishName, setDishName] = useState("")
    const [dishPrice, setDishPrice] = useState(0)
    const history = useHistory();
    const dispatch = useDispatch()

    async function handleNameChange(event: any) {
        setDishName(String(event.target.value))
    }

    async function handlePriceChange(event: any) {
        setDishPrice(Number(event.target.value))
    }

    async function onAddClick(event: any) {
        event.preventDefault()
        await backend.post(dispatch, "/api/dishes/", {
            "name": dishName,
            "price": dishPrice
        })
        history.go(0);
    } 
    
    return (
        <form className="dishes-add" onSubmit={onAddClick}>
            <input style={{ gridArea: "name", margin: "0px", backgroundColor: "#333", borderWidth: "0px", color: "white", fontSize: 14 }} type="text" value={dishName} onChange={handleNameChange}/>
            <input style={{ gridArea: "cost", margin: "0px", backgroundColor: "#333", borderWidth: "0px", color: "white", fontSize: 14 }} type="number" value={dishPrice} onChange={handlePriceChange}/>
            <button className="item-button" style={{ gridArea: "add" }} type="submit"><span className="fa fa-plus"></span></button>
        </form>
    )
}


const Dishes: React.FC = () => {
    const dispatch = useDispatch()
    const uuu = useSelector((state: State) => state)

    React.useEffect(() => {
        dispatch(fetchDishes(uuu.loginStatus.companyId ?? 0))
    }, [dispatch, uuu.loginStatus.companyId]);

    if (uuu.dish.isLoading) {
        return <div className="loader">Loading...</div>
    }

    return (
        <>
            <div className="Catalog">
                <div className="company-dishes-grid-container">
                    <div className="item3">
                        <div className="simple-elements">
                            {uuu.dish.dishes.map((elem) => (
                                <Dish dishData={elem}/>
                            ))}
                            <DishAdd shopId={uuu.loginStatus.accountId}/>
                        </div>
                    </div>
                </div>
            </div></>
    )
}


export default Dishes;