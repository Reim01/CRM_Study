import type { Customer, CustomerActivity, NewCustomer, NewCustomerActivity, } from '../types/customer'

const API_URL = 'https://localhost:7033/api/customers'

export async function getCustomers(): Promise<Customer[]> {
    const response = await fetch(API_URL)

    if(!response.ok){
        throw new Error('고객 목록을 불러오지 못했습니다.');
    }

    return (await response.json()) as Customer[]
}

export async function createCustomer(customer: NewCustomer,): Promise<Customer> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
    })

    if(!response.ok){
        throw new Error('고객을 등록하지 못했습니다.')
    }

    return (await response.json()) as Customer
}

export async function deleteCustomer(customerId: number): Promise<void> {
    const response = await fetch(`${API_URL}/${customerId}`, {
        method: 'DELETE'
    })

    if(!response.ok){
        throw new Error('고객을 삭제하지 못했습니다.')
    }
}

export async function updateCustomer(customerId: number, customer: NewCustomer,): Promise<Customer> {
    const response = await fetch(`${API_URL}/${customerId}`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
    })

    if(!response.ok){
        throw new Error('고객 정보를 수정하지 못했습니다.')
    }

    return (await response.json()) as Customer
}

export async function getCustomerActivities(customerId: number,): Promise<CustomerActivity[]>{
    const response = await fetch(`${API_URL}/${customerId}/activities`)

    if(!response.ok){
        throw new Error('활동 이력을 불러오지 못했습니다.')
    }

    return (await response.json()) as CustomerActivity[]
}

export async function createCustomerActivity(customerId: number, activity: NewCustomerActivity): Promise<CustomerActivity>{
    const response = await fetch(`${API_URL}/${customerId}/activities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
    })

    if(!response.ok){
        throw new Error('활동 이력을 등록하지 못했습니다.')
    }

    return (await response.json()) as CustomerActivity
}