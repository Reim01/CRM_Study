export type CustomerStatus = '잠재 고객' | '진행 중' | '계약 완료'

export type Customer = {
    id: number
    name: string
    company: string
    email: string
    status: CustomerStatus
}

export type NewCustomer = Omit<Customer, 'id'>

///

export type ActivityType = '전화' | '이메일' | '미팅' | '메모'

export type CustomerActivity ={
    id: number
    customerId: number
    type: ActivityType
    content: string
    occurredAt: string
}

export type NewCustomerActivity = {
    type: ActivityType
    content: string
}

///

export type DealStage = '잠재' | '협의' | '제안' | '계약' | '실패'

export type Deal = {
    id: number
    customerId: number
    title: string
    expectedAmount: number
    stage: DealStage
    createdAt: string
}

export type NewDeal = {
    title: string
    expectedAmount: number
    stage: DealStage
}