// FormContext.js
import React, { createContext, useContext } from 'react';
import { useForm } from 'react-hook-form';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <FormContext.Provider value={{ register, handleSubmit, errors }}>
      {children}
    </FormContext.Provider>
  );
};
