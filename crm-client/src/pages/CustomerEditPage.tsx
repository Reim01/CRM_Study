import { useParams } from 'react-router'
import CustomerFormPage from './CustomerFormPage'
import type { Customer, NewCustomer } from '../types/customer'

type CustomerEditPageProps = {
    customers: Customer[]
    onUpdate: (customerId: number, customer: NewCustomer) => Promise<void>
}

function CustomerEditPage({customers, onUpdate,}: CustomerEditPageProps) {
    const { customerId } = useParams()
    
    const customer = customers.find(
        (item) => item.id === Number(customerId),
    )

    if(!customer) {
        return <p>고객 정보를 찾을 수 없습니다.</p>
    }

    const currentCustomer = customer
    
    async function handleUpdate(values: NewCustomer){
        await onUpdate(currentCustomer.id, values)
    }

    return(
        <CustomerFormPage
            customer={currentCustomer}
            onSubmit={handleUpdate}
        />
    )
}

export default CustomerEditPage