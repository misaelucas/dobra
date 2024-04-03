import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'

function AdminPage() {
  const [forms, setForms] = useState([])
  const [year, setYear] = useState('2024')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [expandedFormId, setExpandedFormId] = useState(null)
  const [expandedGroup, setExpandedGroup] = useState(null)

  const groupByProcedure = (formData) => {
    return formData.reduce((acc, item) => {
      const { procedimento } = item
      if (!acc[procedimento]) {
        acc[procedimento] = []
      }
      acc[procedimento].push(item)
      return acc
    }, {})
  }

  function calculateTotalPrice(form) {
    const moneyAmount = parseFloat(form.moneyAmount) || 0
    const pixAmount = parseFloat(form.pixAmount) || 0
    const creditCardAmount = parseFloat(form.creditCardAmount) || 0

    return moneyAmount + pixAmount + creditCardAmount
  }

  function renderPaymentDetails(form) {
    const details = []
    if (form.moneyAmount) details.push(`Dinheiro: ${form.moneyAmount}`)
    if (form.pixAmount) details.push(`Pix: ${form.pixAmount}`)
    if (form.creditCardAmount) details.push(`Cartão: ${form.creditCardAmount}`)

    // Show details if more than one payment type has an amount
    return details.length > 1 ? ` (${details.join(', ')})` : ''
  }

  const fetchForms = async () => {
    console.log('Fetching data with:', { year, month, day })

    if (!year || !month || !day) {
      console.log('Please select all required filters.')
      return
    }

    // Directly use year, month, and day for the query
    const queryString = `year=${year}&month=${month}&day=${day}`

    try {
      const response = await fetch(
        `http://localhost:3000/admin/forms?${queryString}`
      )
      if (response.ok) {
        const formData = await response.json()
        const formattedData = formData.map((form) => ({
          ...form,
          date: moment(form.date).format('YYYY-MM-DD HH:mm:ss'),
        }))

        // Group data by procedures
        const groupedData = groupByProcedure(formattedData)
        setForms(groupedData) // Now `forms` will hold grouped data by procedures
      }

      console.log('Formatted Data fetched:', formattedData)
    } catch (error) {
      console.error('Fetch error:', error.message)
    }
  }

  const handleRowClick = (formId) => {
    // Toggles the expanded state for the clicked form
    setExpandedFormId(expandedFormId === formId ? null : formId)
  }

  return (
    <div className="flex flex-col items-center justify-center my-10 font-mono adminpage ">
      <h2 className="text-2xl font-semibold mb-5 text-white">
        ADMINISTRATIVO{' '}
      </h2>
      {/* Filters */}
      <div className="flex flex-wrap justify-between mb-4 w-full max-w-4xl">
        {/* Year Selection */}
        <div>
          <label htmlFor="yearSelect" className="block text-white">
            Ano
          </label>
          <select
            id="yearSelect"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="form-select mt-1 block w-full bg-gray-100"
          >
            <option value="">Escolher Ano</option>
            {Array.from(
              new Array(5),
              (val, index) => new Date().getFullYear() - index
            ).map((year, i) => (
              <option key={i} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selection */}
        <div>
          <label htmlFor="monthSelect" className="block text-white">
            Mês
          </label>
          <select
            id="monthSelect"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="form-select mt-1 block w-full bg-gray-100"
          >
            <option value="">Selecionar Mês</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selection */}
        <div>
          <label htmlFor="daySelect" className="block text-white">
            Dia
          </label>
          <select
            id="daySelect"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="form-select mt-1 block w-full bg-gray-100"
          >
            <option value="">Escolher Dia</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={() => fetchForms(month, year, day)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
      focus:outline-none"
      >
        PROCURAR
      </button>
      <div className="w-full max-w-4xl ">
        {Object.entries(forms).map(([procedure, entries]) => (
          <div key={procedure}>
            <button
              onClick={() =>
                setExpandedGroup(expandedGroup === procedure ? null : procedure)
              }
              className="py-2 w-full text-left px-2 font-semibold mt-4 bg-green-400 text-black rounded"
            >
              {procedure} ({entries.length})
            </button>
            {expandedGroup === procedure && (
              <table className="table-auto mt-1 bg-slate-800 mt-2 rounded w-full">
                <thead>
                  <tr className=" text-white uppercase text-sm leading-normal bg-slate-900">
                    <th className="py-3 px-6 text-left">Nome</th>
                    <th className="py-3 px-6 text-left">Preço</th>
                    <th className="py-3 px-6 text-left">Pagamento</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm font-light">
                  {entries.map((form, index) => (
                    <tr key={index}>
                      <td className="py-3 px-6 text-left">
                        {form.pacienteNome}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {/* Dynamically calculate and display the price */}
                        {`${calculateTotalPrice(form)}${renderPaymentDetails(form)}`}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {form.payments.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>{' '}
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPage
