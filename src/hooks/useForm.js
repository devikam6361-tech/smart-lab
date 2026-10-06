import { useState } from "react";

const useForm = (initialValues) => {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setFieldValue = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialValues);
  };

  return {
    form,
    setForm,
    handleChange,
    setFieldValue,
    resetForm,
  };
};

export default useForm;