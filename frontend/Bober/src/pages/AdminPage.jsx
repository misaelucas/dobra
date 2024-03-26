import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'

function AdminPage() {
  const [forms, setForms] = useState([])
  const [year, setYear] = useState('2024')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [expandedFormId, setExpandedFormId] = useState(null)

  // Assuming this fetchForms function is called either on button click or after selection of year, month, and day
  const fetchForms = async () => {
    console.log('Fetching data with:', { year, month, day })

    if (!year || !month || !day) {
      console.log('Please select all required filters.')
      return
    }

    const now = moment.tz('America/Sao_Paulo') // Get current time in Sao Paulo timezone
    const adjustedDate = now.subtract(3, 'hours') // Subtract three hours to adjust for UTC-3 timezone

    const queryParts = []
    queryParts.push(`year=${adjustedDate.year()}`)
    queryParts.push(`month=${adjustedDate.month() + 1}`) // Months are zero-based, so add 1
    queryParts.push(`day=${adjustedDate.date()}`)
    queryParts.push(`hour=${adjustedDate.hour()}`)
    queryParts.push(`minute=${adjustedDate.minute()}`)
    queryParts.push(`second=${adjustedDate.second()}`)

    const queryString = queryParts.join('&')

    try {
      const response = await fetch(
        `http://localhost:3000/admin/forms?${queryString}`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const formData = await response.json()
      const formattedData = formData.map((form) => ({
        ...form,
        // Use this line if your date field directly contains the date as a string
        // date: moment(form.date).format('YYYY-MM-DD HH:mm:ss'),

        // Use this line if your date is in an object like { "$date": "2024-03-26T05:29:35.440Z" }
        date: moment(form.date.$date).format('YYYY-MM-DD HH:mm:ss'),
      }))

      console.log('Formatted Data fetched:', formattedData)
      setForms(formattedData) // Update the state with the formatted data
    } catch (error) {
      console.error('Fetch error:', error.message)
    }
  }

  const handleRowClick = (formId) => {
    // Toggles the expanded state for the clicked form
    setExpandedFormId(expandedFormId === formId ? null : formId)
  }

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <h2 className="text-2xl font-semibold mb-5">Admin Page</h2>
      {/* Filters */}
      <div className="flex flex-wrap justify-between mb-4 w-full max-w-4xl">
        {/* Year Selection */}
        <div>
          <label htmlFor="yearSelect" className="block text-gray-700">
            Year
          </label>
          <select
            id="yearSelect"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="form-select mt-1 block w-full bg-gray-100"
          >
            <option value="">Select Year</option>
            {Array.from(
              new Array(20),
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
          <label htmlFor="monthSelect" className="block text-gray-700">
            Month
          </label>
          <select
            id="monthSelect"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="form-select mt-1 block w-full bg-gray-100"
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selection */}
        <div>
          <label htmlFor="daySelect" className="block text-gray-700">
            Day
          </label>
          <select
            id="daySelect"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="form-select mt-1 block w-full bg-gray-100"
          >
            <option value="">Select Day</option>
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
        Fetch Data
      </button>
      <div className="w-full max-w-4xl">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Payments</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {forms.map((form) => (
              <React.Fragment key={form._id}>
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(form._id)}
                >
                  <td className="py-3 px-6 text-left">{form.pacienteNome}</td>
                  <td className="py-3 px-6 text-left">{form.date}</td>
                  <td className="py-3 px-6 text-left">
                    {form.payments.join(', ')}
                  </td>
                </tr>
                {expandedFormId === form._id && (
                  <tr className="bg-gray-100">
                    <td colSpan="3" className="py-3 px-6 text-left">
                      <div>
                        <strong>Observação:</strong> {form.observacao}
                      </div>
                      <div>
                        <strong>Exame:</strong> {form.exame}
                      </div>
                      <div>
                        <strong>Money Amount:</strong> {form.moneyAmount}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPage
