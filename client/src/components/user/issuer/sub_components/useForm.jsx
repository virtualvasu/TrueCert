import { useState } from 'react';

const useForm = (initialState) => {
    const [formValues, setFormValues] = useState(initialState);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    return [formValues, setFormValues, handleChange];
};

export default useForm;
