import React from 'react';

const TemplateSelector = ({ templates, selectedTemplate, handleTemplateChange }) => (
    <div className="mb-6">
        <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Template
        </label>
        <select
            value={selectedTemplate || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
        >
            <option value="" disabled>
                Choose a template
            </option>
            {Object.keys(templates).map((templateName) => (
                <option key={templateName} value={templateName}>
                    {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

export default TemplateSelector;
