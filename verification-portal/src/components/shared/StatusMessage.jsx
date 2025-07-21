import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StatusMessage = ({ message, success }) => {
  return (
    <div
      className={`mt-6 p-4 rounded-xl border shadow-lg ${
        success 
          ? 'bg-green-50 text-green-800 border-green-200' 
          : 'bg-red-50 text-red-800 border-red-200'
      }`}
    >
      <div className="flex items-center">
        {success ? (
          <FaCheckCircle className="mr-3 text-green-500 text-xl" />
        ) : (
          <FaExclamationCircle className="mr-3 text-red-500 text-xl" />
        )}
        <p className="text-base font-medium">{message}</p>
      </div>
    </div>
  );
};

export default StatusMessage;
