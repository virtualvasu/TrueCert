import React from 'react';

const FormFields = ({ fields, formValues, handleChange }) => (
    <div className="space-y-4">
        {fields.map((field) => (
            <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {field.placeholder}
                </label>
                <input
                    type={field.type}
                    name={field.name}
                    value={formValues[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
        ))}
    </div>
);

export default FormFields;
