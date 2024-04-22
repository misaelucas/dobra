import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import moment from 'moment-timezone'
import Header from './Header'

import API_BASE_URL from '../config';

function Form() {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  const [payments, setPayments] = useState([])
  const currentDate = new Date().toISOString().split('T')[0]

  const onSubmit = async (data) => {
    if (!window.confirm('Tem certeza que quer adicionar essa entrada?')) {
      return; // Stop submission if not confirmed
    }

    const procedureValue =
      data.procedureType === 'especialidade'
        ? data.especialidadeMedico
        : data.exame;

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
    };

    try {
      const response = await fetch(`${API_BASE_URL}/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        alert('Entrada adicionada!');
        // Reset all form fields to initial state
        reset({
          pacienteNome: '',
          observacao: '',
          moneyAmount: '',
          creditCardAmount: '',
          pixAmount: '',
          especialidadeMedico: '',
          exame: '',
        });
        // Reset custom states
        setPayments([]);
      } else {
        console.error('Erro em enviar o formulário:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
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
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen mt-4 bg-slate-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="font-sans text-lg w-full sm:w-1/2 px-4 py-6 bg-white rounded-lg  ring-2 ring-green-400/50 ring-offset-4 ring-offset-slate-800 overflow-y-auto max-h-screen "
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
              className={`px-4 py-2 rounded focus:outline-none hover:bg-blue-500 hover:text-white ${procedureType === 'especialidade' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              Especialidade
            </button>
            <button
              type="button"
              onClick={() => handleOptionClick('exame')}
              className={`px-4 py-2 rounded focus:outline-none hover:bg-blue-500 hover:text-white ${procedureType === 'exame' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-700'}`}
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
                <option value="Clinico">Clínico Geral</option>
                <option value="Cardiologia">Cardiologista</option>
                <option value="Dermatologia">Dermatologista</option>
                <option value="Endocrinologia">Endocrinologista</option>
                <option value="Gastroenterologia">Gastroenterologista</option>
                <option value="Geriatria">Geriatra</option>
                <option value="Ginecologia">Ginecologista</option>
                <option value="Nefrologia">Nefrologista</option>
                <option value="Neurologia">Neurologista</option>
                <option value="Nutricionista">Nutricionista</option>
                <option value="Ortopedia">Ortopedista</option>
                <option value="Otorrinolaringologia">
                  Otorrinolaringologia
                </option>
                <option value="Psicologia">Psicóloga</option>
                <option value="Urologia">Urologista</option>
                <option value="Vascular">Vascular</option>
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
                <option value="Aplicação com Glicose">Aplicação com Glicose</option>
                <option value="Aplicação de espuma">Aplicação de Espuma</option>
                <option value="ASO">ASO</option>
                <option value="Atestado">Atestado</option>
                <option value="Audiometria">Audiometria</option>
                <option value="Biópsia">Biópsia</option>
                <option value="Eco de Carótidas">Eco de Carótidas</option>
                <option value="Ecocardiograma">ECO</option>
                <option value="Eletrocardiograma">ECG</option>
                <option value="Endoscopia">Endoscopia</option>
                <option value="Espirometria">Espirometria</option>
                <option value="Fototerapia">Fototerapia</option>
                <option value="Hemograma">Hemograma</option>
                <option value="Holter">Holter</option>
                <option value="Impedanciometria">Impedanciometria</option>
                <option value="Lab">LAB</option>
                <option value="Mapa">Mapa</option>
                <option value="Peniscopia">Peniscopia</option>
                <option value="Perfil Lipídico">Perfil Lipídico</option>
                <option value="Procedimento Dermato">Procedimento Dermato</option>
                <option value="Procedimento Gineco">Procedimento Gineco</option>
                <option value="Procedimento Urologista">Procedimento Urologista</option>
                <option value="Raio-x">Raio-X</option>
                <option value="USG ABD Inferior">USG ABD Inferior</option>
                <option value="USG ABD Superior">USG ABD Superior</option>
                <option value="USG ABD Total">USG ABD Total</option>
                <option value="USG Bolsa Escrotal">USG Bolsa Escrotal</option>
                <option value="USG MI D">USG MI D</option>
                <option value="USG MI E">USG MI E</option>
                <option value="USG MMII">USG MMII</option>
                <option value="USG Pélvica">USG Pélvica</option>
                <option value="USG Próstata">USG Próstata</option>
                <option value="USG Rins e Vias Urinárias">USG Rins e Vias Urinárias</option>
                <option value="Videolaparoscopia/Vídeonasolaringoscopia">Videolaparoscopia/Vídeonasolaringoscopia</option>

              </select>
            </div>
          ) : null}

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
            <p className="text-red-600 font-bold">
              Por favor, escolha um método de pagamento!
            </p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  )
}

export default Form
