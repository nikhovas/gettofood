import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import { changePasswordAccount, fetchAccount, updateAccount } from "../../store/actions/account"


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


interface AccountDataPasswordFieldProperties {
    onPasswordApprove: (oldPassword: string, newpassword: string) => void
}


class AccountDataPasswordField extends React.Component<AccountDataPasswordFieldProperties> {
    onPasswordApproveParent: (oldPassword: string, newpassword: string) => void
    state: {
        oldPassword: string
        newPassword: string
        newPasswordRepeat: string
    }


    constructor(props: AccountDataPasswordFieldProperties) {
        super(props);
        this.onPasswordApproveParent = props.onPasswordApprove
        this.state = {
            oldPassword: "",
            newPassword: "",
            newPasswordRepeat: ""
        }
    }

    handleOldChange(event: any) {
        this.setState({oldPassword: event.target.value})
    }

    handleNewChange(event: any) {
        this.setState({newPassword: event.target.value})
    }

    handleNewRepeatChange(event: any) {
        this.setState({newPasswordRepeat: event.target.value})
    }

    handleSubmit(event: any) {
        if (this.state.newPassword !== this.state.newPasswordRepeat) {
            alert("Пароли не совпадают")
        } else {
            this.onPasswordApproveParent(this.state.oldPassword, this.state.newPassword)
        }
        event.preventDefault()
    }

    render() {
        document.title = "Аккаунт"

        return (
            <div style={{fontSize: '14pt', marginBottom: '10px'}}>
                <form className="account-edit-block" onSubmit={this.handleSubmit.bind(this)}>
                    <h2 className="account-label" >Поменять пароль</h2>
                    <div className="account-label">Старый пароль</div>
                    <input className="account-text-input" type="password" onChange={this.handleOldChange.bind(this)}/>
                    <div className="account-label">Новый пароль</div>
                    <input className="account-text-input" type="password" onChange={this.handleNewChange.bind(this)}/>
                    <div className="account-label">Повторите пароль</div>
                    <input className="account-text-input" type="password" onChange={this.handleNewRepeatChange.bind(this)}/>
                    <div className="inline-account-grid">
                        <button type="submit" className="default-button"><span className="fa fa-check"></span></button>
                        <button className="default-button"><span className="fa fa-times"></span></button>
                    </div>
                </form>
            </div>
        )
    }
}


function Account() {
    const dispatch = useDispatch()
    const account = useSelector((state: State) => state.account)
    React.useEffect(() => {
        dispatch(fetchAccount())
    }, [dispatch]);
    if (account.isLoading) {
        return <div className="loader">Loading...</div>
    }
    async function onApprove(name: string, value: string) {
        dispatch(updateAccount(name, value))
    }
    async function onPasswordApprove(oldPassword: string, newPassword: string) {
        dispatch(changePasswordAccount(oldPassword, newPassword))
    }
    return (
        <>
            <div className="Account">
                <div className="account-info-grid">
                    <div style={{fontSize: '14pt', marginBottom: '10px'}}>
                        <h2 className="account-label">Данные</h2>
                        <AccountDataField accountData={{name: "Имя", field: "name", value: account.data.name}} onApprove={onApprove}></AccountDataField>
                        <AccountDataField accountData={{name: "Фамилия", field: "surname", value: account.data.surname}} onApprove={onApprove}></AccountDataField>
                    </div>
                    <div style={{fontSize: '14pt', marginBottom: '10px'}}>
                        <h2 className="account-label">Контакты</h2>
                        <AccountDataField accountData={{name: "Телефон", field: "phone", value: account.data.phone}} onApprove={onApprove}></AccountDataField>
                        <AccountDataField accountData={{name: "Почта", field: "email", value: account.data.email}} onApprove={onApprove}></AccountDataField>
                    </div>
                    <AccountDataPasswordField onPasswordApprove={onPasswordApprove}/>
                </div>
            </div>
        </>
    )
}


export default Account;