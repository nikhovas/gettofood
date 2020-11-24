import React, { useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { fetchCompany, updateCompany } from "../../store/actions/company";
import Header from "../Header";


interface AccountDataFieldData {
    field: string
    value: string
    name: string
}

interface AccountDataFieldProperties {
    accountData: AccountDataFieldData
    onApprove: (name: string, value: string) => void
}


class AccountDataField extends React.Component<AccountDataFieldProperties> {
    state: AccountDataFieldData
    onApproveParent: (name: string, value: string) => void


    constructor(props: AccountDataFieldProperties) {
        super(props);
        this.state = props.accountData
        this.onApproveParent = props.onApprove
    }

    handleChange(event: any) {
        this.setState({value: event.target.value})
    }

    handleSubmit(event: any) {
        this.onApproveParent(this.state.field, this.state.value)
        event.preventDefault()
    }

    render() {
        return (
            <form className="account-edit-block" onSubmit={this.handleSubmit.bind(this)}>
                <div className="account-label">{this.state.name}</div>
                <input className="account-text-input" type="text" value={this.state.value} onChange={this.handleChange.bind(this)}/>
                <div className="inline-account-grid">
                    <button className="default-button"><span className="fa fa-check"></span></button>
                    <button className="default-button"><span className="fa fa-times"></span></button>
                </div>
            </form>
        )
    }
}


interface CityFormProps {
    field: string
    value: number
    name: string
    onApprove: (name: string, value: any) => void
    values: City[]
}


function CityForm(props: CityFormProps) {
    const [value, setValue] = useState(props.value)

    function handleChange(event: any) {
        console.log("OIOIOIOI")
        console.log(event.target.value)
        setValue(Number(event.target.value))
    }

    return (
        <form className="account-edit-block" onSubmit={() => props.onApprove(props.field, value)}>
            <div className="account-label">{props.name}</div>
            <select className="select-css" onChange={handleChange} value={value}>
                {props.values.map((elem: any) => (
                    <option value={elem.id}>{elem.name}</option>
                ))}
            </select>
            <div className="inline-account-grid">
                <button className="default-button"><span className="fa fa-check"></span></button>
                <button className="default-button"><span className="fa fa-times"></span></button>
            </div>
        </form>
    )
    
}


function Company() {
    const dispatch = useDispatch()
        const company = useSelector((state: State) => state.company)
        const cities = useSelector((state: State) => state.database.database.cities)

        React.useEffect(() => {
            dispatch(fetchCompany())
        }, [dispatch]);

        if (company.isLoading) {
            return <div className="loader">Loading...</div>
        }

        console.log(company)

        async function onApprove(name: string, value: any) {
            dispatch(updateCompany(name, value, company.company.id))
        }

        return (
            <>
                <Header current='account' accountType="company" />
                <div className="Account">
                    <div className="account-info-grid">
                        <div style={{fontSize: '14pt', marginBottom: '10px'}}>
                            <AccountDataField accountData={{name: "Название", field: "name", value: company.company.name}} onApprove={onApprove}/>
                        </div>
                        <div style={{fontSize: '14pt', marginBottom: '10px'}}>
                            <CityForm field="city" value={company.company.city} name= "Город" onApprove={onApprove} values={cities}/>
                        </div>
                    </div>
                </div>
            </>
        )
}


export default Company;