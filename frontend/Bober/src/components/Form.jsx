import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import moment from 'moment-timezone'
import Header from './Header'
import { useAppContext } from '../contexts/AppContext'
import Notification from './Notifications'
import '../App.css'

function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()
  const [procedureType, setProcedureType] = useState('specialties')
  const [procedureValue, setProcedureValue] = useState('')
  const [payments, setPayments] = useState([])
  const { userId } = useAppContext()
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

  const procedures = {
    specialties: {
      'Clínico Geral': 300,
      'Cardiologista': 450,
      'Dermatologista': 350,
      'Endocrinologista': 400,
      'Gastroenterologista': 350,
      'Geriatra': 300,
      'Ginecologista': 400,
      'Nefrologista': 350,
      'Neurologista': 350,
      'Nutricionista': 150,
      'Ortopedista': 350,
      'Otorrinolaringologista': 350,
      'Psicóloga': 100,
      'Urologista': 350,
      'Vascular': 350,
    },
    exams: {
      'ASO': 60,
      'Atestado': 200,
      'Audiometria': 80,
      'Biópsia': 200,
      'Eco de Carótidas': 350,
      'Ecocardiograma (ECO)': 350,
      'Eletrocardiograma (ECG)': 70,
      'Endoscopia': 320,
      'Espirometria': 170,
      'Fototerapia': 150,
      'Hemograma': 30,
      'Holter': 250,
      'Impedanciometria': 80,
      'LAB': 50,
      'Mapa': 250,
      'Peniscopia': 250,
      'Perfil Lipídico': 100,
      'Raio-X': 100,
      'USG ABD Inferior': 180,
      'USG ABD Superior': 180,
      'USG ABD Total': 180,
      'USG Bolsa Escrotal': 250,
      'USG MI D': 300,
      'USG MI E': 300,
      'USG MMII': 600,
      'USG Perna E': 300,
      'USG Perna D': 300,
      'USG Pélvica': 180,
      'USG Próstata': 180,
      'USG Rins e Vias Urinárias': 180,
      'Vídeonasolaringoscopia': 150,
    },
  }
  const options =
    procedureType === 'specialties'
      ? Object.keys(procedures.specialties).map((key) => ({
          value: key,
          label: key,
        }))
      : Object.keys(procedures.exams).map((key) => ({
          value: key,
          label: key,
        }))

  useEffect(() => {
    if (!procedureValue && options.length > 0) {
      setProcedureValue(options[0].value)
    }
  }, [procedureType, options])

  useEffect(() => {
    if (
      procedureValue &&
      procedureType &&
      procedures[procedureType] &&
      procedures[procedureType][procedureValue]
    ) {
      const price = procedures[procedureType][procedureValue] || 0

      setValue('moneyAmount', payments.includes('Dinheiro') ? price : 0)
      setValue(
        'creditCardAmount',
        payments.includes('Cartão de Crédito') ? price : 0
      )
      setValue('pixAmount', payments.includes('Pix') ? price : 0)
    }
  }, [procedureValue, payments, procedures, procedureType, setValue])

  const handlePaymentChange = (event) => {
    const { value, checked } = event.target
    setPayments((prev) =>
      checked ? [...prev, value] : prev.filter((payment) => payment !== value)
    )
  }

  const onSubmit = async (data) => {
    if (payments.length === 0) {
      alert('Por favor, escolha pelo menos um método de pagamento!')
      return
    }

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
      addedBy: userId,
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/submit-form`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        }
      )

      if (response.ok) {
        showNotification('Entrada adicionada!', 'success')
        reset()
        setPayments([])
      } else {
        console.error('Erro em enviar o formulário:', response.statusText)
      }
    } catch (error) {
      showNotification('Failed to submit form: ' + error.message, 'error')
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center text-black justify-center min-h-screen mt-4 bg-slate-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="font-sans text-lg w-full sm:w-1/2 px-4 py-12 bg-white rounded-lg ring-2 ring-green-400/50 ring-offset-4 ring-offset-slate-800 overflow-y-auto max-h-screen"
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
                  message: 'O nome é muito pequeno.',
                },
              })}
              type="text"
              id="pacienteNome"
              data-testid="pacienteNome"
              className="form-input mt-1 pl-2 block w-full bg-gray-300 border-slate-600 rounded-md shadow-sm focus:border-slate-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {errors.pacienteNome && (
              <p className="text-red-600">{errors.pacienteNome.message}</p>
            )}
          </div>
          <div className="mb-4 flex justify-evenly text-black space-x-4">
            <button
              type="button"
              onClick={() => setProcedureType('specialties')}
              className={`px-4 py-2 rounded focus:outline-none ${
                procedureType === 'specialties'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 hover:bg-blue-600 hover:text-white'
              }`}
              data-testid="specialty-button"
            >
              Especialidade
            </button>
            <button
              type="button"
              onClick={() => setProcedureType('exams')}
              className={`px-4 py-2 rounded focus:outline-none ${
                procedureType === 'exams'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 hover:bg-blue-600 hover:text-white'
              }`}
              data-testid="exam-button"
            >
              Exame
            </button>
          </div>
          <Select
            options={options}
            value={options.find((option) => option.value === procedureValue)}
            onChange={(selectedOption) =>
              setProcedureValue(selectedOption.value)
            }
            className="mb-4"
          />

          <div className="mb-4 mt-1">
            <label htmlFor="payments" className="block">
              Formas de Pagamento:
            </label>
            <div>
              <label className="inline-flex items-center ">
                <input
                  type="checkbox"
                  value="Pix"
                  {...register('paymentMethod', {
                    validate: () => payments.length > 0,
                  })}
                  checked={payments.includes('Pix')}
                  onChange={handlePaymentChange}
                  className="form-checkbox custom-checkbox"
                  style={{ backgroundColor: 'white', borderColor: 'gray' }}
                  data-testid="pix-checkbox"
                />
                <span className="ml-2">Pix</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="checkbox"
                  value="Dinheiro"
                  {...register('paymentMethod', {
                    validate: () => payments.length > 0,
                  })}
                  checked={payments.includes('Dinheiro')}
                  onChange={handlePaymentChange}
                  data-testid="dinheiro-checkbox"
                />
                <span className="ml-2">Dinheiro</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="checkbox"
                  value="Cartão de Crédito"
                  {...register('paymentMethod', {
                    validate: () => payments.length > 0,
                  })}
                  className="form-checkbox"
                  checked={payments.includes('Cartão de Crédito')}
                  onChange={handlePaymentChange}
                  data-testid="cartao-checkbox"
                />
                <span className="ml-2">Cartão de Crédito</span>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-600">{errors.paymentMethod.message}</p>
            )}
          </div>
          {payments.includes('Pix') && (
            <div className="mb-4">
              <label htmlFor="pixAmount" className="block text-gray-700">
                Valor do Pix
              </label>
              <input
                {...register('pixAmount')}
                type="number"
                id="pixAmount"
                data-testid="pixAmount"
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
                type="number"
                id="moneyAmount"
                data-testid="moneyAmount"
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
                type="number"
                id="creditCardAmount"
                data-testid="creditCardAmount"
                className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}
          {payments.length === 0 && (
            <p className="text-red-600 font-bold">
              Por favor, escolha um método de pagamento!
            </p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            data-testid="submit-button"
          >
            Enviar
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

export default Form
