import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const InputField = ({ value, onChange, placeholder, isValid }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {isValid && (
        <div className="absolute top-0 right-2 text-indigo-500">
          <FaCheckCircle />
        </div>
      )}
    </div>
  );
};

export default InputField;
