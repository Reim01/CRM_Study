import type { Customer } from '../types/customer'

export const mockCustomers: Customer[] = [
    {
        id: 1,
        name: '김민수',
        company: '에이콘 주식회사',
        email: 'minsu@acorn.co.kr',
        status: '진행 중'
    },
    {
        id: 2,
        name: '이지은',
        company: '브릿지랩',
        email: 'jieun@bridgelab.co.kr',
        status: '잠재 고객',
    },
    {
        id: 3,
        name: '박서준',
        company: '오로라 스튜디오',
        email: 'seojun@aurora.co.kr',
        status: '계약 완료',
    },
]