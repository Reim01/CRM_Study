import { useEffect, useState, type FormEvent } from 'react'
import {
    createCustomerActivity,
    getCustomerActivities,
} from '../api/customers'
import type {
    ActivityType,
    CustomerActivity,
} from '../types/customer'

type CustomerActivitySectionProps = {
    customerId: number
}

function CustomerActivitySection({customerId,}: CustomerActivitySectionProps){
    const [activities, setActivities] = useState<CustomerActivity[]>([])
    const [type, setType] = useState<ActivityType>('전화')
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() =>{
        async function loadActivities(){
            try{
                setIsLoading(true)

                const data = await getCustomerActivities(customerId)
                setActivities(data)
            } catch{
                setError('활동 이력을 불러오지 못했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        loadActivities()
    }, [customerId])

    async function handleSubmit(event: FormEvent<HTMLFORMLELEMENT>){
        event.preventDefault()

        try{
            const activity = await createCustomerActivity(customerId, {
                type,
                content,
            })

            setActivities((currentActivities) => [
                activity,
                ...currentActivities,
            ])

            setContent('')
        } catch {
            setError('활동 이력을 등록하지 못했습니다.')
        }
    }

    return (
        <section className="activity-section">
            <h3>활동 이력</h3>

            <form className="activity-form" onSubmit={handleSubmit}>
                <select
                    value={type}
                    onChange={(event) => setType(event.target.value as ActivityType)}>
                    <option value="전화">전화</option>
                    <option value="이메일">이메일</option>
                    <option value="미팅">미팅</option>
                    <option value="메모">메모</option>
                </select>

                <input
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="활동 내용을 입력하세요"
                required />

                <button type="submit">기록</button>
            </form>

            {isLoading && <p>활동 이력을 불러오는 중입니다...</p>}

            {error && <p className="activity-error">{error}</p>}

            {!isLoading && activities.length === 0 && (
                <p className="empty-activities">아직 활동 이력이 없습니다.</p>)}

            <div className="activity-list">
                {activities.map((activity) => (
                <article className="activity-item" key={activity.id}>
                    <span className="activity-type">{activity.type}</span>
                    <p>{activity.content}</p>
                    <time>
                        {new Date(activity.occurredAt).toLocaleString('ko-KR')}
                    </time>
                </article>))}
            </div>
        </section>
    )
}

export default CustomerActivitySection