import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useClerks } from "../../context/ClerkContext";

const initialState = {
  name: "",
  email: "",
  employeeId: "",
  department: "",
};

const ClerkForm = ({
  editingClerk,
  onFinishEdit,
}) => {
  const {
    addClerk,
    updateClerk,
  } = useClerks();

  const {
    addUser,
    updateUser,
  } = useAuth();

  const [form, setForm] =
    useState(initialState);

  useEffect(() => {
    if (editingClerk) {
      setForm(editingClerk);
    } else {
      setForm(initialState);
    }
  }, [editingClerk]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.employeeId ||
      !form.department
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingClerk) {
      updateClerk(editingClerk.id, form);

      updateUser(editingClerk.userId, {
        name: form.name,
        email: form.email,
        department: form.department,
      });

      onFinishEdit();

      setForm(initialState);

      return;
    }

    const result = addUser({
      name: form.name,
      email: form.email,
      password: "123456",
      role: "clerk",
      department: form.department,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    addClerk({
      userId: result.user.id,

      employeeId: form.employeeId,

      name: form.name,

      email: form.email,

      department: form.department,
    });

    alert(
      "Clerk created.\nDefault Password : 123456"
    );

    setForm(initialState);
  };

  return (
    <form
      onSubmit={submit}
      className="border p-5 rounded space-y-3"
    >
      <h2 className="text-xl font-bold">
        {editingClerk
          ? "Edit Clerk"
          : "Add Clerk"}
      </h2>

      <input
        className="border p-2 w-full"
        placeholder="Clerk Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full"
        placeholder="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full"
        placeholder="Employee ID"
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full"
        placeholder="Department"
        name="department"
        value={form.department}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="border px-4 py-2"
      >
        Save Clerk
      </button>
    </form>
  );
};

export default ClerkForm;