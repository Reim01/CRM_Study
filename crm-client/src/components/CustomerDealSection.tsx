import { useEffect, useState, type FormEvent } from 'react'
import {
    createCustomerDeal,
    getCustomerDeals,
} from '../api/customers'

import type {
    Deal,
    DealStage,
} from '../types/customer'

type CustomerDealSectionProps = {
    customerId: number
}

function CustomerDealSection({customerId,}: CustomerDealSectionProps){
    const [deals, setDeals] = useState<Deal[]>([])
    const [title, setTitle] = useState('')
    const [expectedAmount, setExpectedAmount] = useState('')
    const [stage, setStage] = useState<DealState>('잠재')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadDeals() {
            try{
                setIsLoading(true)

                const data = await getCustomerDeals(customerId)
                setDeals(data)
            }catch{
                setError('거래 목록을 불러오지 못했습니다.')
            } finally{
                setIsLoading(false)
            }            
        }

        loadDeals()
    }, [customerId])

    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        try{
            const deal = await createCustomerDeal(customerId, {
                title, expectedAmount: Number(expectedAmount),
                stage,
            })

            setDeals((currentDeals) => [deal, ...currentDeals])

            setTitle('')
            setExpectedAmount('')
            setStage('잠재')
        } catch{
            setError('거래를 등록하지 못했습니다.')
        }
    }

    return (
        <section className="deal-section">
            <h3>거래</h3>

            <form className="deal-form" onSubmit={handleSubmit}>
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="거래명"
                    required />

                <input
                    type="number"
                    value={expectedAmount}
                    onChange={(event) => setExpectedAmount(event.target.value)}
                    placeholder="예상 금액"
                    min="0"
                    step="1000"
                    required />

                <select
                    value={stage}
                    onChange={(event) => setStage(event.target.value as DealStage)}>
                    <option value="잠재">잠재</option>
                    <option value="협의">협의</option>
                    <option value="제안">제안</option>
                    <option value="계약">계약</option>
                    <option value="실패">실패</option>
                </select>

                <button type="submit">거래 추가</button>
            </form>

            {isLoading && <p>거래 목록을 불러오는 중입니다...</p>}

            {error && <p className="activity-error">{error}</p>}

            {!isLoading && deals.length === 0 && (
                <p className="empty-activities">등록된 거래가 없습니다.</p>)}

            <div className="deal-list">
                {deals.map((deal) => (
                <article className="deal-item" key={deal.id}>
                    <div>
                        <strong>{deal.title}</strong>
                        <p>{deal.stage}</p>
                    </div>
                    <span>
                        {deal.expectedAmount.toLocaleString('ko-KR')}원
                    </span>
                </article>
                ))}
            </div>
        </section>
    )
}

export default CustomerDealSection