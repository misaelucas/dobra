import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import logo from '../assets/logo.png'
import { useAppContext } from '../contexts/AppContext' // Make sure the path is correct

function AdminPage() {
  const { userRole } = useAppContext()
  const timeZone = 'America/Sao_Paulo' // This matches GMT-3
  const today = new Date(new Date().toLocaleString('en-US', { timeZone }))
  const todayFormatted = today.toISOString().split('T')[0] // Format to YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(todayFormatted)

  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1 // getMonth is 0-indexed, add 1 for 1-indexed
  const currentDay = today.getDate()

  const [forms, setForms] = useState([])
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [day, setDay] = useState(currentDay)
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
    if (userRole === 'receptionist') {
      // Lock the date to today for receptionists
      setYear(today.getFullYear())
      setMonth(today.getMonth() + 1)
      setDay(today.getDate())
    }
  }, [userRole, today])
  // Additional useEffect for fetching forms and expenses when date changes
  useEffect(() => {
    fetchForms()
    fetchExpenses()
  }, [year, month, day])

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
        `${import.meta.env.VITE_API_BASE_URL}/admin/forms?${queryString}`
      )
      if (response.ok) {
        const formData = await response.json()
        console.log('Received form data:', formData) // Check what data you received

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
    if (!year || !month || !day) {
      return // Do not fetch if date is incomplete
    }

    const paddedMonth = month.toString().padStart(2, '0')
    const paddedDay = day.toString().padStart(2, '0')
    const queryString = `year=${year}&month=${paddedMonth}&day=${paddedDay}`
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/expenses?${queryString}`
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
        console.error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Fetch error:', error.message)
    }
  }

  const handleDelete = async (formId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/forms/${formId}`,
        {
          method: 'DELETE',
        }
      )
      if (!response.ok) throw new Error('Failed to delete the form.')

      // Update local state to reflect the change
      setForms((forms) => {
        const updatedForms = { ...forms }
        for (const procedure in updatedForms) {
          updatedForms[procedure] = updatedForms[procedure].filter(
            (form) => form._id !== formId
          )
        }
        return updatedForms
      })

      alert('Entrada deletada.') // Add confirmation alert
    } catch (error) {
      console.error('Error deleting form:', error)
      alert(error.message) // Show error message to the user
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/expenses/${expenseId}`,
        {
          method: 'DELETE',
        }
      )
      if (!response.ok) throw new Error('Failed to delete the expense.')

      // Update local state to reflect the change
      setExpenses((expenses) =>
        expenses.filter((expense) => expense._id !== expenseId)
      )

      alert('Despesa deletada.')
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert(error.message)
    }
  }

  return (
    <div className="!bg-slate-800">
      <Header />
      <div className="flex justify-center mt-4">
        <img src={logo} alt="Logo" className="w-48" />
      </div>
      <div className="flex flex-col items-center justify-center pt-2 !bg-slate-800 font-sans text-lg adminpage">
        <div className="flex flex-wrap justify-between mb-4 w-full max-w-4xl">
          <div>
            <label htmlFor="yearSelect" className="block text-white">
              Ano
            </label>
            <select
              id="yearSelect"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="form-select mt-1 block w-full bg-gray-100"
              disabled={userRole === 'receptionist'}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={today.getFullYear() - i}>
                  {today.getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="monthSelect" className="block text-white">
              Mês
            </label>
            <select
              id="monthSelect"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="form-select mt-1 block w-full bg-gray-100"
              disabled={userRole === 'receptionist'}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', {
                    month: 'long',
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="daySelect" className="block text-white">
              Dia
            </label>
            <select
              id="daySelect"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="form-select mt-1 block w-full bg-gray-100"
              disabled={userRole === 'receptionist'}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={fetchForms}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
        >
          Procurar
        </button>

        <div className="w-full max-w-4xl ">
          {Object.entries(forms)
            .sort((a, b) => a[0].localeCompare(b[0])) // Sort by procedure name which is `a[0]` and `b[0]`
            .map(([procedure, entries]) => (
              <div key={procedure}>
                <button
                  onClick={() =>
                    setExpandedGroup(
                      expandedGroup === procedure ? null : procedure
                    )
                  }
                  className="py-2 w-full text-left px-2 mt-4 bg-green-400 text-black rounded"
                >
                  {`${procedure} (${entries.length})`} - R$
                  {calculateTotalPriceForProcedure(procedure)}
                </button>

                {expandedGroup === procedure && (
                  <table className="table-auto mt-1 bg-slate-900 mt-2 rounded w-full">
                    <thead>
                      <tr className="text-white uppercase text-sm leading-normal bg-slate-900">
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">Preço</th>
                        <th className="py-3 px-6 text-left">Pagamento</th>
                        <th className="py-3 px-6 text-left">Usuário</th>
                      </tr>
                    </thead>
                    <tbody className="text-white text-sm font-light">
                      {entries
                        .slice() // Creates a shallow copy to avoid mutating the original array during sorting
                        .sort((a, b) =>
                          a.pacienteNome.localeCompare(b.pacienteNome)
                        ) // Sorts alphabetically by patient name within each procedure group
                        .map((form, index) => (
                          <tr key={index} className="border text-lg">
                            <td className="py-3 px-6 text-left">
                              {form.pacienteNome}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {`${calculateTotalPrice(form)}${renderPaymentDetails(form)}`}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {form.payments.join(', ')}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {form.addedBy}
                            </td>
                            <td className="py-3 px-6 text-left">
                              <button
                                onClick={() => handleDelete(form._id)}
                                className="text-white p-1 rounded bg-red-500 hover:text-red-700"
                              >
                                Apagar
                              </button>
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
                Valor total com despesas inclusas:
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

            {expenses.length > 0 && (
              <div className="expense-summary bg-slate-900 text-white rounded-lg p-2">
                <h3 className="text-lg">Despesas:</h3>
                {expenses.map((expense, index) => (
                  <div key={index} className="expense-item">
                    <p>
                      {expense.description}: R$
                      {parseFloat(expense.amount).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold text-sm py-1 px-2 rounded"
                    >
                      Deletar
                    </button>
                  </div>
                ))}
                <p className="mt-4">
                  Total Despesas: R${expenseSum.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
