import { Link, useNavigate, useParams }  from 'react-router'
import type { Customer } from '../types/customer'

type CustomerDetailPageProps = {
  customers: Customer[]
  onDelete: (customerId: number) => Promise<void>
}


function CustomerDetailPage({ customers, onDelete, }: CustomerDetailPageProps){
    const { customerId } = useParams()
    const navigate = useNavigate()

    const customer = customers.find(
        (item) => item.id === Number(customerId),
    )

    if(!customer){
        return <p>고객 정보를 찾을 수 없습니다.</p>
    }

    async function handleDelete(customerId: number, customerName: string){
        const confirmed = window.confirm(
            `${customerName} 고객을 삭제할까요?`,
        )

        if(!confirmed){
            return
        }

        try {
            await onDelete(customerId)
            navigate('/')
        } catch{
            window.alert('고객 삭제에 실패했습니다. 서버 상태를 확인하세요.')
        }
    }

    return (
        <section>
            <Link className="back-link" to="/">
                ← 고객 목록으로
            </Link>

            <p className="eyebrow">CUSTOMER DETAIL</p>
            <h2>{customer.name}</h2>

            <article className="detail-card">
                <p><strong>회사</strong> {customer.company}</p>
                <p><strong>이메일</strong> {customer.email}</p>
                <p><strong>상태</strong> {customer.status}</p>
                <div className="detail-actions">
                    <Link className="edit-button" to={`/customers/${customer.id}/edit`}>
                        고객 수정
                    </Link>
                    <button className="danger-button" type="button" onClick={() => handleDelete(customer.id, customer.name)}>
                        고객 삭제
                    </button>
                </div>
            </article>
        </section>
    )
}

export default CustomerDetailPage