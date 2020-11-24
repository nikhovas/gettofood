/// <reference types="react-scripts" />

interface DishModel {
  id: BigInt64Array,
  name: string,
  price: BigInt64Array,
  shopId: number
}


interface ModalState {
    modalName: string
  }
  
  interface DishState {
    dishes: DishModel[]
    isLoading: boolean
    isError: boolean,
    currentShopId: number
  }

  interface BasketState {
    orders: ClientOrder[]
    isLoading: boolean
    isError: boolean
  }

  interface HistoryOrderType {
    active: []
    completed: []
  }

  interface HistoryState {
    orders: HistoryOrderType
    isLoading: boolean
    isError: boolean
  }

  interface AccountData {
    name: string
    surname: string
    phone: string
    email: string
  }

  interface AccountState {
    data: AccountData
    isLoading: boolean
    isError: boolean
  }

  interface City {
    name: string
    id: number
  }

  interface Shop {
    name: string
    city: number
    id: number
    user: number
  }

  interface DatabaseData {
    cities: City[],
    shops: Shop[]
  }

  interface DatabaseState {
    database: DatabaseData
    isLoading: boolean
    isError: boolean
  }

  interface LoginStatus {
    token: string
    refresh: string
    companyAllow: boolean
    accountId: number
    accountType: string
    companyId: number?
  }

  interface ClientOrderDish {
    id: number
    name: string
    count: number
  }

  interface ClientOrder {
    city: string
    shopName: string
    shop: Shop
    order_items: OrderItemData[]
    client: any
    id: number
    status: string
  }

  interface OrderState {
    orders: ClientOrder[]
    isLoading: boolean
    isError: boolean
  }

  interface CompanyModel {
    name: string,
    city: number,
    id: number
  }

  interface CompanyState {
    company: CompanyModel
    isLoading: boolean
    isError: boolean
  }
  
  interface State {
    modal: ModalState
    dish: DishState
    basket: BasketState
    history: HistoryState
    account: AccountState
    database: DatabaseState
    loginStatus: LoginStatus
    orders: OrderState
    company: CompanyState
  }