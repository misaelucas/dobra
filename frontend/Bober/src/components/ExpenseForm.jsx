import React, { useState } from 'react'
import Header from './Header'
import logo from '../assets/logo.png'
import Notification from './Notifications'

function ExpenseForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Set default date to today
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !description || !date) {
      alert('Por favor, preencha todos os campos')
      return
    }

    // Validate that amount is a number and not NaN
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount)) {
      alert('Por favor, digite um número válido')
      return
    }

    const expenseData = {
      amount: numericAmount, // Use the parsed amount
      description,
      date,
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/expenses`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        }
      )

      if (response.ok) {
        showNotification('Despesa adicionada!', 'success')
        setAmount('')
        setDescription('')
        setDate(new Date().toISOString().split('T')[0]) // Reset date to today
      } else {
        alert('Falha ao adicionar despesa')
      }
    } catch (error) {
      showNotification('Failed to submit expense: ' + error.message, 'error')
      alert('Erro ao enviar despesa!')
    }
  }

  return (
    <>
      <Header />
      <div className="flex justify-center mt-2">
        <a href="/">
          {' '}
          <img src={logo} alt="Logo" className="w-48" />{' '}
        </a>
      </div>

      <div className="flex flex-col items-center justify-center mx-4 bg-slate-800">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-5 rounded shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Valor
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0" // Ensures non-negative numbers
              step="0.01" // Allow decimal values
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descrição
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Adicionar despesa
          </button>
        </form>
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  )
}

export default ExpenseForm
