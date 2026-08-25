export type CustomerStatus = '잠재 고객' | '진행 중' | '계약 완료'

export type Customer = {
    id: number
    name: string
    company: string
    email: string
    status: CustomerStatus
}

export type NewCustomer = Omit<Customer, 'id'>