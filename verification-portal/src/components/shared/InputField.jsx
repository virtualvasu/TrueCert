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
        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
      />
      {isValid && (
        <div className="absolute top-3 right-3 text-purple-500">
          <FaCheckCircle />
        </div>
      )}
    </div>
  );
};

export default InputField;
