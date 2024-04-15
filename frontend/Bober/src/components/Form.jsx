import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import moment from 'moment-timezone'
import bober from '../assets/boberkurva.gif'
function Form() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()
  const [payments, setPayments] = useState([])
  const currentDate = new Date().toISOString().split('T')[0]

  const onSubmit = async (data) => {
    if (!window.confirm('Tem certeza que quer adicionar essa entrada?')) {
      return // Stop submission if not confirmed
    }

    const procedureValue =
      data.procedureType === 'especialidade'
        ? data.especialidadeMedico
        : data.exame

    let submissionData = {
      pacienteNome: data.pacienteNome,
      date: moment(data.date)
        .tz('America/Sao_Paulo', true)
        .subtract(3, 'hours')
        .toISOString(),
      procedimento: procedureValue,
      payments: payments,
      observacao: data.observacao || '',
      moneyAmount: data.moneyAmount || '',
      creditCardAmount: data.creditCardAmount || '',
      pixAmount: data.pixAmount || '',
    }

    try {
      const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        alert('Entrada adicionada!')
      } else {
        console.error('Erro em enviar o formulário:', response.statusText)
      }
    } catch (error) {
      console.error('Error submitting form:', error.message)
    }
  }

  const handlePaymentChange = (event) => {
    const { value, checked } = event.target
    setPayments(
      checked
        ? [...payments, value]
        : payments.filter((payment) => payment !== value)
    )
  }

  // Dynamically adjust form based on selection
  const procedureType = watch('procedureType')
  const handleOptionClick = (optionType) => {
    setValue('procedureType', optionType)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
      <img src={bober} alt="bober" className="w-50 rounded my-2" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="font-sans mb-4 text-lg w-full sm:w-1/2 px-4 py-6 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen mt-4 sm:mt-0"
      >
        <div className="mb-4">
          <label htmlFor="pacienteNome" className="block text-gray-700">
            Nome do Paciente
          </label>
          <input
            {...register('pacienteNome', {
              required: 'Você precisa preencher esse campo.',
              minLength: {
                value: 8,
                message: 'O nome é muito pequeno... :P',
              },
            })}
            type="text"
            id="pacienteNome"
            className="form-input mt-1 pl-2 block w-full bg-gray-300 border-slate-600 rounded-md shadow-sm focus:border-slate-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.pacienteNome && (
            <p className="text-red-500 mt-2 font-mono">
              {errors.pacienteNome.message}
            </p>
          )}
        </div>
        <div className="mb-4 flex justify-evenly space-x-4">
          <button
            type="button"
            onClick={() => handleOptionClick('especialidade')}
            className={`px-4 py-2 rounded focus:outline-none ${procedureType === 'especialidade' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            Especialidade
          </button>
          <button
            type="button"
            onClick={() => handleOptionClick('exame')}
            className={`px-4 py-2 rounded focus:outline-none ${procedureType === 'exame' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            Exame
          </button>
        </div>
        {procedureType === 'especialidade' ? (
          <div className="mb-4">
            <label
              htmlFor="especialidadeMedico"
              className="block text-gray-700"
            >
              Especialidade
            </label>
            <select
              {...register('especialidadeMedico')}
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
        ) : procedureType === 'exame' ? (
          <div className="mb-4">
            <label htmlFor="exame" className="block text-gray-700">
              Exame
            </label>
            <select
              {...register('exame')}
              className="bg-gray-100 form-select mt-1 block w-full"
            >
              <option value="Audiometria">Audiometria</option>
              <option value="Biópsia">Biópsia</option>
              <option value="Ecocardiograma">Ecocardiograma</option>
              <option value="Eletrocardiograma">Eletrocardiograma</option>
              <option value="Endoscopia">Endoscopia</option>
              <option value="Fototerapia">Fototerapia</option>
              <option value="Holter">Holter</option>
              <option value="Mapa">Mapa</option>
              <option value="Perfil Lipídico">Perfil Lipídico</option>
              <option value="Raio-x">Raio-X</option>
              <option value="USG Abd Total">USG Abd Total</option>
              <option value="USG Abd Inferior">USG Abd Inferior</option>
              <option value="USG Abd Superior">USG Abd Superior</option>
              <option value="USG Bolsa Escrotal">USG Bolsa Escrotal</option>
              <option value="USG Rins e Vias Urinárias">
                USG Rins e Vias Urinárias
              </option>
              <option value="USG Próstata">USG Próstata</option>
            </select>
          </div>
        ) : null}
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700">
            Data
          </label>
          <input
            {...register('date')}
            type="date"
            defaultValue={currentDate}
            className="bg-gray-100 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                value="Pix"
                {...register('paymentMethod', {
                  validate: () => payments.length > 0,
                })} // Custom validation for at least one checkbox
                onChange={handlePaymentChange}
                className="form-checkbox"
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
        {payments.length === 0 && (
          <p className="text-red-500">
            Por favor, escolha um método de pagamento!
          </p>
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
