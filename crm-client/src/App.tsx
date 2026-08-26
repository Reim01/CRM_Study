import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router'

import type { Customer, NewCustomer } from './types/customer'
import { createCustomer, deleteCustomer, getCustomers, updateCustomer as updateCustomerRequest,} from './api/customers'

import DashboardPage from './pages/DashboardPage'
import CustomerDetailPage from './pages/CustomerDetailPage'
import CustomerFormPage from './pages/CustomerFormPage'
import CustomerEditPage from './pages/CustomerEditPage'

import './index.css'

function App() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() =>{
    async function loadCustomers() {
      try{
        const data = await getCustomers()
        setCustomers(data)
      } catch {
        setError('API 서버에 연결할 수 없습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])
  
  async function addCustomer(customer: NewCustomer){
    const createdCustomer = await createCustomer(customer)

    setCustomers((currentCustomers) => [
      ...currentCustomers,
      createdCustomer,
    ])
  }

  async function removeCustomer(customerId: number){
    await deleteCustomer(customerId)
    
    setCustomers((currentCustomers) =>
      currentCustomers.filter((customer) => customer.id !== customerId),
    )
  }

  async function updateCustomer(customerId: number, customer: NewCustomer,): Promise<void> {
    const updatedCustomer = await updateCustomerRequest(customerId, customer)

    setCustomers((currentCustomers) =>
      currentCustomers.map((item) =>
        item.id === customerId ? updatedCustomer : item,
      ),
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <h1 className="logo">Simple CRM</h1>

        <nav className="navigation" aria-label="주 메뉴">
          <NavLink className={({ isActive }) =>
            `navigation-item${isActive ? ' active' : ''}`
          }
          to="/"
          end>대시보드</NavLink>
          
          <NavLink className="navigation-item" to="/">
            고객
          </NavLink>

          <a className="navigation-item" href='#activities'>
            활동 기록
          </a>
        </nav>
      </aside>

      <section className="content">
        {isLoading && <p className="page-message">고객 정보를 불러오는 중입니다...</p>}
        
        {error && <p className="page-message error-message">{error}</p>}

        {!isLoading && !error && (
          <Routes>
            <Route path="/" element={<DashboardPage customers={customers} />} />
            <Route path="/customers/new" element={<CustomerFormPage onSubmit={addCustomer} />} />
            <Route path="/customers/:customerId" element={<CustomerDetailPage customers={customers} onDelete={removeCustomer} />} />
            <Route path="/customers/:customerId/edit" element={<CustomerEditPage customers={customers} onUpdate={updateCustomer} />} />
          </Routes>
        )}        
      </section>      
    </main>
  )
}

export default App
