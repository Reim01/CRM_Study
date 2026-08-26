import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import type { Customer, CustomerStatus, NewCustomer } from '../types/customer'

type CustomerFormPageProps = {
    customer?: Customer
    onSubmit: (customer: NewCustomer) => Promise<void>
}

function CustomerFormPage({ customer, onSubmit }: CustomerFormPageProps){
    const navigate = useNavigate()

    const [name, setName] = useState(customer?.name ?? '')
    const [company, setCompany] = useState(customer?.company ?? '')
    const [email, setEmail] = useState(customer?.email ?? '')
    const [status, setStatus] = useState<CustomerStatus>(customer?.status ?? '잠재 고객')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try{
            await onSubmit({
                name,
                company,
                email,
                status,
            })
            
            navigate('/')
        } catch{
            window.alert('고객 등록에 실패했습니다. 서버 상태를 확인하세요.')
        }                
    }

    return (
        <section>
            <Link className="back-link" to="/">
                ← 고객 목록으로
            </Link>

            <p className="eyebrow">
                {customer ? 'EDIT CUSTOMER' : 'NEW CUSTOMER'}
            </p>
            <h2>{customer? '고객 수정' : '고객 등록'}</h2>

            <form className="customer-form" onSubmit={handleSubmit}>
                <label>
                    이름
                    <input
                        value={name} 
                        onChange={(event) => setName(event.target.value)} 
                        placeholder="고객 이름" 
                        required 
                    />
                </label>

                <label>
                    회사
                    <input 
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        placeholder="회사명"
                        required
                    />
                </label>

                <label>
                    이메일
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@example.com"
                        required
                    />
                </label>

                <label>
                    고객 상태
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value as CustomerStatus)}
                    >
                        <option value="잠재 고객">잠재 고객</option>
                        <option value="진행 중">진행 중</option>
                        <option value="계약 완료">계약 완료</option>
                    </select>
                </label>

                <div className="form-actions">
                    <Link className="cancel-button" to="/">
                        취소
                    </Link>
                    <button type="submit">저장</button>
                </div>
            </form>
        </section>
    )
}

export default CustomerFormPage