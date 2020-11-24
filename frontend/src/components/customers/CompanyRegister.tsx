import React from "react";
import {useSelector} from "react-redux";
import Header from "../Header";
import backend from "../../utils/backend";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";


interface IFormInput {
    name: string
    city: number
}


function CompanyRegister() {
    const database = useSelector((state: State) => state.database)

    const { register, handleSubmit } = useForm<IFormInput>();
    const history = useHistory()

    if (database.isLoading) {
        return <div>Loading...</div>
    } else if (database.isError) {
        return <div>Error</div>
    }

    const cities = database.database.cities

    const onSubmit = async (data: IFormInput) => {
        const response = await backend.post("/api/companies/", {
            name: data.name,
            city: data.city
        })
        if (response.ok) {
            history.push('/login');
        } else {
            alert("Ошибка")
        }
        console.log(data)
    };

    return (
        <>
            <Header current='account' accountType="customer"/>
            <div className="Account">
                <div className="account-info-grid"
                     style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                    <div style={{fontSize: '14pt', marginBottom: '10px', width: "600px"}}>
                        <form className="account-edit-block" onSubmit={handleSubmit(onSubmit)}>
                            <div className="account-label">Название</div>
                            <input className="account-text-input" type="text" name="name" ref={register}/>

                            <div className="account-label">Город</div>
                            <select className="select-css" name="city" ref={register}>
                                {cities.map((elem: any) => (
                                    <option value={elem.id}>{elem.name}</option>
                                ))}
                            </select>
                            <button className="default-button" style={{marginTop: "10px"}}>Зарегестрировать компанию
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyRegister