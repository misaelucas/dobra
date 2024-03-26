import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import moment from 'moment-timezone'

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [payments, setPayments] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const currentDate = new Date().toISOString().split('T')[0] // Get current date in "YYYY-MM-DD" format

  const onSubmit = async (data) => {
    // Adjust the 'date' field in 'data' to include current time and adjust for UTC-3
    // Assuming 'data.date' comes in "YYYY-MM-DD" format and you want to add the current time in UTC-3
    const now = moment().tz('America/Sao_Paulo') // Get current time in UTC-3 timezone
    const adjustedDate = moment(data.date)
      .tz('America/Sao_Paulo', true)
      .subtract(3, 'hours')

    // Replace 'date' with the adjusted datetime
    data.date = adjustedDate.toISOString()

    try {
      const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        console.log('Form submitted successfully')
        // Optionally, you can perform additional actions here after successful form submission
      } else {
        console.error('Failed to submit form:', response.statusText)
      }
    } catch (error) {
      console.error('Error submitting form:', error.message)
    }
  }

  const handlePaymentChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setPayments([...payments, value])
    } else {
      setPayments(payments.filter((payment) => payment !== value))
    }
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="font-serif w-full sm:w-1/2 px-4 py-6 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen mt-4 sm:mt-0"
      >
        <div className="mb-4">
          <label htmlFor="pacienteNome" className="block text-gray-700">
            Nome do Paciente
          </label>
          <input
            {...register('pacienteNome')}
            type="text"
            id="pacienteNome"
            className="form-input mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div className="mb-4 flex justify-evenly space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-l focus:outline-none ${selectedOption === 'especialidade' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleOptionClick('especialidade')}
          >
            Especialidade
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r focus:outline-none ${selectedOption === 'exame' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleOptionClick('exame')}
          >
            Exame
          </button>
        </div>

        {selectedOption === 'especialidade' && (
          <div className="mb-4">
            <label
              htmlFor="especialidadeMedico"
              className="block text-gray-700"
            >
              Especialidade
            </label>
            <select
              {...register('especialidadeMedico')}
              id="especialidadeMedico"
              className="bg-gray-100 form-select mt-1 block w-full"
            >
              <option value="Dermatologia">Clínico Geral</option>
              <option value="Dermatologia">Dermatologia</option>
              <option value="Endocrinologia">Endocrinologia</option>
              <option value="Gastroenterologia">Gastroenterologia</option>
              <option value="Geriatria">Geriatria</option>
              <option value="Ginecologia">Ginecologia</option>
              <option value="Nefrologia">Nefrologia</option>
              <option value="Neurologia">Neurologia</option>
              <option value="Nutrição">Nutrição</option>
              <option value="Ortopedia">Ortopedia</option>
              <option value="Otorrinolaringologia">Otorrinolaringologia</option>
              <option value="Cardiologia">Cardiologia</option>
              <option value="Cirurgia Vascular">Cirurgia Vascular</option>
              <option value="Psicologia">Psicologia</option>
              <option value="Urologia">Urologia</option>
            </select>
          </div>
        )}

        {selectedOption === 'exame' && (
          <div className="mb-4">
            <label htmlFor="exame" className="block text-gray-700">
              Exame
            </label>
            <select
              {...register('exame')}
              id="exame"
              className="bg-gray-100 form-select mt-1 block w-full"
            >
              <option value="Audiometria">Audiometria</option>
              <option value="Biópsia">Biópsia</option>
              <option value="Ecocardiograma">Ecocardiograma</option>
              <option value="Eletrocardiograma">Eletrocardiograma</option>
              <option value="Eletroencefalograma">Eletroencefalograma</option>
              <option value="Endoscopia">Endoscopia</option>
              <option value="Holter">Holter</option>
              <option value="Mapa">Mapa</option>
              <option value="Perfil Lipídico">Perfil Lipídico</option>
              <option value="Raio-x">Raio-x</option>
              <option value="Ultrassonografia Abd Total">
                Ultrassonografia Abd Total
              </option>
              <option value="Ultrassonografia Abd Inferior">
                Ultrassonografia Abd Inferior
              </option>
              <option value="Ultrassonografia Abd Superior">
                Ultrassonografia Abd Superior
              </option>
              <option value="Ultrassonografia Bolsa Escrotal">
                Ultrassonografia Bolsa Escrotal
              </option>
              <option value="Ultrassonografia Rins e Vias Urinárias">
                Ultrassonografia Rins e Vias Urinárias
              </option>
              <option value="Ultrassonografia Próstata">
                Ultrassonografia Próstata
              </option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700">
            Data
          </label>
          <input
            {...register('date')}
            type="date"
            defaultValue={currentDate}
            id="date"
            className="bg-gray-100   form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="payments" className="block text-gray-700">
            Formas de Pagamento
          </label>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('payments')}
                value="Pix"
                className="form-checkbox"
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Pix</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="checkbox"
                {...register('payments')}
                value="Dinheiro"
                className="form-checkbox"
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Dinheiro</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="checkbox"
                {...register('payments')}
                value="Cartão de Crédito"
                className="form-checkbox"
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Cartão de Crédito</span>
            </label>
          </div>
        </div>

        {payments.includes('Pix') && (
          <div className="mb-4">
            <label htmlFor="pixAmount" className="block text-gray-700">
              Valor do Pix
            </label>
            <input
              {...register('pixAmount')}
              type="text"
              id="pixAmount"
              className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        )}

        {payments.includes('Dinheiro') && (
          <div className="mb-4">
            <label htmlFor="moneyAmount" className="block text-gray-700">
              Valor em Dinheiro
            </label>
            <input
              {...register('moneyAmount')}
              type="text"
              id="moneyAmount"
              className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        )}

        {payments.includes('Cartão de Crédito') && (
          <div className="mb-4">
            <label htmlFor="creditCardAmount" className="block text-gray-700">
              Valor do Cartão de Crédito
            </label>
            <input
              {...register('creditCardAmount')}
              type="text"
              id="creditCardAmount"
              className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        )}

        <div className="mb-4 ">
          <label htmlFor="observacao" className="block text-gray-700 ">
            Observação
          </label>
          <textarea
            {...register('observacao')}
            id="observacao"
            className="form-textarea mt-1 block w-full bg-gray-200 border-0 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-1"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

export default Form
