import React, { useState } from 'react';

import { useForm } from 'react-hook-form';


function Form() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [payments, setPayments] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");

    const onSubmit = (data) => {
      console.log(data);
    };  
  
    const handlePaymentChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setPayments([...payments, value]);
      } else {
        setPayments(payments.filter((payment) => payment !== value));
      }
    };
  
    return (      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <form onSubmit={handleSubmit(onSubmit)} className="font-serif w-full sm:w-1/2 px-4 py-6 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen mt-4 sm:mt-0">
  
        <div className="mb-4">
        <label htmlFor="pacienteNome" className="block text-gray-700">Nome do Paciente</label>
        <input {...register("pacienteNome")} type="text" id="pacienteNome" className="form-input mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-gray-100" />
      </div>
      <div className="mb-4 flex justify-evenly space-x-4">
  <button 
    className={`px-4 py-2 rounded-l focus:outline-none ${selectedOption === "especialidade" ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
    onClick={() => setSelectedOption("especialidade")}
  >
    Especialidade
  </button>
  <button 
    className={`px-4 py-2 rounded-r focus:outline-none ${selectedOption === "exame" ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
    onClick={() => setSelectedOption("exame")}
  >
    Exame
  </button>
</div>



{selectedOption === "especialidade" && (
  <div className="mb-4">
    <label htmlFor="especialidadeMedico" className="block text-gray-700">Especialidade</label>
    <select {...register("especialidadeMedico")} id="especialidadeMedico" className="bg-gray-100 form-select mt-1 block w-full">
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

{selectedOption === "exame" && (
  <div className="mb-4">
    <label htmlFor="exame" className="block text-gray-700">Exame</label>
    <select {...register("exame")} id="exame" className="bg-gray-100 form-select mt-1 block w-full">
      <option value="Exame 1">Exame 1</option>
      {/* Add other options for exame */}
    </select>
  </div>
)}

      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700">Data</label>
        <input {...register("date")} type="date" id="date" className="bg-gray-100   form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
      </div>

      <div className="mb-4">
        <label htmlFor="payments" className="block text-gray-700">Formas de Pagamento</label>
        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" {...register("payments")} value="Pix" className="form-checkbox" onChange={handlePaymentChange} />
            <span className="ml-2">Pix</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input type="checkbox" {...register("payments")} value="Dinheiro" className="form-checkbox" onChange={handlePaymentChange} />
            <span className="ml-2">Dinheiro</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input type="checkbox" {...register("payments")} value="Cartão de Crédito" className="form-checkbox" onChange={handlePaymentChange} />
            <span className="ml-2">Cartão de Crédito</span>
          </label>
        </div>
      </div>

      {payments.includes("Pix") && (
        <div className="mb-4">
          <label htmlFor="pixAmount" className="block text-gray-700">Valor do Pix</label>
          <input {...register("pixAmount")} type="text" id="pixAmount" className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
        </div>
      )}

      {payments.includes("Dinheiro") && (
        <div className="mb-4">
          <label htmlFor="moneyAmount" className="block text-gray-700">Valor em Dinheiro</label>
          <input {...register("moneyAmount")} type="text" id="moneyAmount" className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
        </div>
      )}

      {payments.includes("Cartão de Crédito") && (
        <div className="mb-4">
          <label htmlFor="creditCardAmount" className="block text-gray-700">Valor do Cartão de Crédito</label>
          <input {...register("creditCardAmount")} type="text" id="creditCardAmount" className="pl-2 form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
        </div>
      )}

<div className="mb-4 ">
  <label htmlFor="observacao" className="block text-gray-700 ">Observação</label>
  <textarea {...register("observacao")} id="observacao" className="form-textarea mt-1 block w-full bg-gray-300 border-0 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-1"></textarea>
</div>


      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Enviar</button>
    </form>
  </div>
);
}

export default Form;