import React from 'react';

const ActionButton = ({ onClick, loading, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-purple-600 hover:bg-purple-700 hover:shadow-xl'
      }`}
      disabled={disabled || loading}
    >
      {loading ? 'Checking...' : children}
    </button>
  );
};

export default ActionButton;
