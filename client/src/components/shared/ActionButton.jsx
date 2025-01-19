import React from 'react';

const ActionButton = ({ onClick, loading, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
        loading
          ? 'bg-indigo-300 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
      disabled={disabled || loading}
    >
      {loading ? 'Checking...' : children}
    </button>
  );
};

export default ActionButton;
