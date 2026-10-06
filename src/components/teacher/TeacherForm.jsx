import { useState, useEffect } from "react";
import { useTeachers } from "../../context/TeacherContext";
import { useAuth } from "../../context/AuthContext";

const initialState = {
  name: "",
  email: "",
  employeeId: "",
  department: "",
};

const TeacherForm = ({ editingTeacher, onFinishEdit }) => {
  const { addTeacher, updateTeacher } = useTeachers();

  const { addUser, updateUser } = useAuth();

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingTeacher) {
      setForm(editingTeacher);
    } else {
      setForm(initialState);
    }
  }, [editingTeacher]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.employeeId || !form.department) {
      alert("Please fill all fields");
      return;
    }

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, form);

      updateUser(editingTeacher.userId, {
        name: form.name,
        email: form.email,
        department: form.department,
      });

      onFinishEdit();

      setForm(initialState);

      return;
    }

    // ---------- Create Login Account ----------

    const result = addUser({
      name: form.name,
      email: form.email,
      password: "123456",
      role: "teacher",
      department: form.department,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    // ---------- Create Teacher Profile ----------

    addTeacher({
      userId: result.user.id,
      employeeId: form.employeeId,
      name: form.name,
      email: form.email,
      department: form.department,
      assignedLabs: [],
    });

    alert("Teacher created.\nDefault Password : 123456");

    setForm(initialState);
  };

  return (
    <form onSubmit={submit} className="border p-5 rounded space-y-3">
      <h2 className="text-xl font-bold">
        {editingTeacher ? "Edit Teacher" : "Add Teacher"}
      </h2>

      <input
        className="border p-2 w-full"
        placeholder="Teacher Name"
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

      <button className="border px-4 py-2" type="submit">
        Save Teacher
      </button>
    </form>
  );
};

export default TeacherForm;
