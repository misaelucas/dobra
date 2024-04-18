import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'
import Header from '../components/Header'

function AdminPage() {
  const [forms, setForms] = useState([])
  const [year, setYear] = useState('2024')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [expandedFormId, setExpandedFormId] = useState(null)
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [totalSum, setTotalSum] = useState(0)
  const [cashSum, setCashSum] = useState(0)
  const [digitalSum, setDigitalSum] = useState(0)
  const [expenses, setExpenses] = useState([])
  const [expenseSum, setExpenseSum] = useState(0)

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

  useEffect(() => {
    if (year && month && day) {
      fetchExpenses()
    }
  }, [year, month, day]) // This will refetch expenses whenever the date filters change

  function calculateTotalPrice(form) {
    const moneyAmount = parseFloat(form.moneyAmount) || 0
    const pixAmount = parseFloat(form.pixAmount) || 0
    const creditCardAmount = parseFloat(form.creditCardAmount) || 0

    return moneyAmount + pixAmount + creditCardAmount
  }
  const calculateTotalPriceForProcedure = (procedure) => {
    const formsForProcedure = forms[procedure]
    if (!formsForProcedure || !formsForProcedure.length) {
      return 0
    }

    let totalPrice = 0
    formsForProcedure.forEach((form) => {
      const moneyAmount = parseFloat(form.moneyAmount) || 0
      const pixAmount = parseFloat(form.pixAmount) || 0
      const creditCardAmount = parseFloat(form.creditCardAmount) || 0
      totalPrice += moneyAmount + pixAmount + creditCardAmount
    })

    return totalPrice.toFixed(2)
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

        // Group data by procedures
        const groupedData = groupByProcedure(formData)

        // Calculate totals
        let total = 0
        let cash = 0
        let digital = 0
        formData.forEach((form) => {
          const moneyAmount = parseFloat(form.moneyAmount) || 0
          const pixAmount = parseFloat(form.pixAmount) || 0
          const creditCardAmount = parseFloat(form.creditCardAmount) || 0

          total += moneyAmount + pixAmount + creditCardAmount
          cash += moneyAmount
          digital += pixAmount + creditCardAmount
        })

        setTotalSum(total)
        setCashSum(cash)
        setDigitalSum(digital)

        setForms(groupedData) // Update the state with grouped data by procedures
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Fetch error:', error.message)
    }
  }

  const fetchExpenses = async () => {
    const paddedMonth = month.toString().padStart(2, '0')
    const paddedDay = day.toString().padStart(2, '0')
    const queryString = `year=${year}&month=${paddedMonth}&day=${paddedDay}`
    try {
      const response = await fetch(
        `http://localhost:3000/admin/expenses?${queryString}`
      )
      if (response.ok) {
        const expenseData = await response.json()
        setExpenses(expenseData)
        const totalExpenses = expenseData.reduce(
          (sum, expense) => sum + parseFloat(expense.amount),
          0
        )
        setExpenseSum(totalExpenses)
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Fetch error:', error.message)
    }
  }

  useEffect(() => {
    if (year && month && day) {
      fetchExpenses()
    }
  }, [year, month, day]) // Re-fetch expenses when date filters change

  return (
    <div className="!bg-slate-800">
      <Header />
      <div className="flex flex-col items-center justify-center pt-2 !bg-slate-800 font-sans text-lg adminpage ">
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
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700
      focus:outline-none"
        >
          PROCURAR
        </button>

        <div className="w-full max-w-4xl ">
          {Object.entries(forms).map(([procedure, entries]) => (
            <div key={procedure}>
              <button
                onClick={() =>
                  setExpandedGroup(
                    expandedGroup === procedure ? null : procedure
                  )
                }
                className="py-2 w-full text-left px-2 mt-4 bg-green-400 text-black rounded"
              >
                {`${procedure} (${entries.length})`} -{' '}
                {calculateTotalPriceForProcedure(procedure)}
              </button>

              {expandedGroup === procedure && (
                <table className="table-auto mt-1 bg-slate-900  mt-2 rounded w-full">
                  <thead>
                    <tr className=" text-white uppercase   text-sm leading-normal bg-slate-900">
                      <th className="py-3 px-6 text-left ">Nome</th>
                      <th className="py-3 px-6 text-left ">Preço</th>
                      <th className="py-3 px-6 text-left ">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody className="text-white text-sm font-light">
                    {entries
                      .slice() // Creates a shallow copy to avoid mutating the original array during sorting
                      .sort((a, b) =>
                        a.pacienteNome.localeCompare(b.pacienteNome)
                      ) // Sorts alphabetically
                      .map((form, index) => (
                        <tr key={index} className="border">
                          <td className="py-3 px-6  text-left">
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
                  </tbody>
                </table>
              )}
            </div>
          ))}
          <div className="flex w-[500px] bg-slate-900 ring-2  !ring-green-600/50 !ring-offset-slate-800 ring-offset-4  text-white rounded-lg shadow mt-4 mb-4 w-full">
            <div className="w-full rounded p-2 flex flex-col">
              <h3 className="text-lg mb-1 ">
                Valor Total com despesas inclusas:
              </h3>
              <p>R${(totalSum - expenseSum).toFixed(2)}</p>
              <div className="w-full rounded ">
                <h3 className="text-lg mb-1 mt-4">Valor total em dinheiro:</h3>
                <p className="font-bold">R${cashSum.toFixed(2)}</p>
              </div>
              <div className="w-full rounded mt-4">
                <h3 className="text-lg mb-1">Valor total em pix e cartão:</h3>
                <p className="font-bold">R${digitalSum.toFixed(2)}</p>
              </div>
            </div>

            <div className="expense-summary bg-slate-900  text-white rounded-lg p-2 ">
              <h3 className="text-lg">Despesas:</h3>
              {expenses.map((expense, index) => (
                <div key={index} className="expense-item ">
                  <p className="">
                    {expense.description}: R$
                    {parseFloat(expense.amount).toFixed(2)}
                  </p>
                </div>
              ))}
              <p className="mt-4 ">Total Despesas: R${expenseSum.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
