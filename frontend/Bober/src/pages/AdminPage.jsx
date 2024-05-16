import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import logo from '../assets/logo.png'
import { useAppContext } from '../contexts/AppContext' // Make sure the path is correct
import Notification from '../components/Notifications'

function AdminPage() {
  const { userRole } = useAppContext()
  const timeZone = 'America/Sao_Paulo' // This matches GMT-3
  const today = new Date(new Date().toLocaleString('en-US', { timeZone }))

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
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    show: false,
  })
  const showNotification = (message, type) => {
    setNotification({ message, type, show: true })
  }

  const handleClose = () => {
    setNotification({ ...notification, show: false })
  }

  const handleAccordionChange = (procedure) => {
    setExpandedGroup(expandedGroup === procedure ? null : procedure)
  }

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

      showNotification('Entrada deletada!', 'success')
    } catch (error) {
      console.error('Error deleting form:', error)
      showNotification('Falha ao deletar entrada: ' + error.message, 'error')
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
        <a href="/">
          {' '}
          <img src={logo} alt="Logo" className="w-48" />{' '}
        </a>
      </div>
      <div className="flex flex-col items-center justify-center pt-2 !bg-slate-800 font-sans text-black text-lg adminpage">
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
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([procedure, entries], index) => (
              <div key={procedure} className="collapse mt-2 !rounded-none">
                <input
                  type="radio"
                  name="my-accordion-2"
                  id={`accordion-${index}`}
                  className="peer"
                  checked={expandedGroup === procedure}
                  onChange={() => handleAccordionChange(procedure)}
                />
                <div className="collapse-title text-xl font-medium bg-green-400 text-black">
                  {`${procedure} (${entries.length}) - R$${calculateTotalPriceForProcedure(procedure)}`}
                </div>
                <div className="collapse-content bg-slate-900 text-white ">
                  <table className="table-auto w-full ">
                    <thead>
                      <tr className="uppercase text-lg leading-normal">
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">Preço</th>
                        <th className="py-3 px-6 text-left">Pagamento</th>
                        <th className="py-3 px-6 text-left">Usuário</th>
                      </tr>
                    </thead>
                    <tbody className="text-lg font-light">
                      {entries
                        .slice() // Creates a shallow copy to avoid mutating the original array during sorting
                        .sort((a, b) =>
                          a.pacienteNome.localeCompare(b.pacienteNome)
                        )
                        .map((form, idx) => (
                          <tr key={idx} className="border">
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
                                className="text-white p-1 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center"
                                aria-label="Delete"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          {notification.show && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={handleClose}
            />
          )}

          <div className="flex w-[500px] bg-slate-900 ring-2  !ring-green-600/50 !ring-offset-slate-800 ring-offset-4  text-white rounded shadow mt-4 mb-4 w-full">
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
              <div className="expense-summary bg-slate-900 text-white rounded p-2">
                <h3 className="text-lg">Despesas:</h3>
                {expenses.map((expense, index) => (
                  <div key={index} className="expense-item">
                    <p>
                      {expense.description}: R$
                      {parseFloat(expense.amount).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-white p-1 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center"
                      aria-label="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
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
