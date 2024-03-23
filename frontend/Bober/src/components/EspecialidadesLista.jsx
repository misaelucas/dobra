// OptionSelect.js
import React from 'react';

function OptionSelect({ label, id, register, options }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700">
        {label}
      </label>
      <select
        {...register(id)}
        id={id}
        className="bg-gray-100 form-select mt-1 block w-full"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export default OptionSelect;
