import { useState } from 'react'
import { Link } from 'react-router'
import type { Customer } from '../types/customer'

type DashboardPageProps = {
    customers: Customer[]
}

function DashboardPage({ customers}: DashboardPageProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter((customer) => {
    const keyword = searchTerm.toLowerCase()

    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.company.toLowerCase().includes(keyword)
    )
  })

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">DASHBOARD</p>
          <h2>안녕하세요, 관리자님</h2>
          <p className="description">고객과 상담 기록을 한곳에서 관리하세요.</p>
        </div>
        <Link className="primary-link" to="/customers/new">
            고객 추가 
        </Link>
      </header>

      <section className="summary-grid">
        <article className="summary-card">
          <p>전체 고객</p>
          <strong>{customers.length}</strong>
        </article>
        <article className="summary-card">
          <p>신규 고객</p>
          <strong>1</strong>
        </article>
        <article className="summary-card">
          <p>오늘 할 일</p>
          <strong>3</strong>
        </article>
      </section>

      <section className="customer-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CUSTOMERS</p>
            <h3>최근 고객 ({filteredCustomers.length})</h3>
          </div>

          <label className="search-box">
            <span>고객 검색</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="이름 또는 회사명 검색"
            />
          </label>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>회사</th>
                <th>이메일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <Link className="customer-link" to={`/customers/${customer.id}`}>
                      {customer.name}
                    </Link>
                  </td>
                  <td>{customer.company}</td>
                  <td>{customer.email}</td>
                  <td>
                    <span className={`status status-${customer.status}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-message">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default DashboardPage