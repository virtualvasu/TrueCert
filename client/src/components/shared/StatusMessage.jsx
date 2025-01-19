import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StatusMessage = ({ message, success }) => {
  return (
    <div
      className={`mt-6 p-4 rounded-lg ${
        success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      <div className="flex items-center">
        {success ? (
          <FaCheckCircle className="mr-2 text-green-500" />
        ) : (
          <FaExclamationCircle className="mr-2 text-red-500" />
        )}
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};

export default StatusMessage;
