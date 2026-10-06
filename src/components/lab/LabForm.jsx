import { useEffect, useState } from "react";
import { useLabs } from "../../contexts/LabContext";

const initialState = {
  labCode: "",
  labName: "",
  department: "",
  capacity: "",
  building: "",
  floor: "",
  systems: "",
};

const LabForm = ({ editingLab, onFinishEdit }) => {
  const { addLab, updateLab } = useLabs();

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingLab) {
      setForm(editingLab);
    }
  }, [editingLab]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (editingLab) {
      updateLab(editingLab.id, form);
      onFinishEdit();
    } else {
      addLab(form);
    }

    setForm(initialState);
  };

  return (
    <form onSubmit={submit} className="border p-5 rounded space-y-3">

      <h2 className="text-xl font-bold">
        {editingLab ? "Edit Lab" : "Add Lab"}
      </h2>

      <input
        name="labCode"
        placeholder="Lab Code"
        className="border p-2 w-full"
        value={form.labCode}
        onChange={handleChange}
      />

      <input
        name="labName"
        placeholder="Lab Name"
        className="border p-2 w-full"
        value={form.labName}
        onChange={handleChange}
      />

      <input
        name="department"
        placeholder="Department"
        className="border p-2 w-full"
        value={form.department}
        onChange={handleChange}
      />

      <input
        name="capacity"
        placeholder="Capacity"
        className="border p-2 w-full"
        value={form.capacity}
        onChange={handleChange}
      />

      <input
        name="building"
        placeholder="Building"
        className="border p-2 w-full"
        value={form.building}
        onChange={handleChange}
      />

      <input
        name="floor"
        placeholder="Floor"
        className="border p-2 w-full"
        value={form.floor}
        onChange={handleChange}
      />

      <input
        name="systems"
        placeholder="Number of Systems"
        className="border p-2 w-full"
        value={form.systems}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="border px-4 py-2"
      >
        Save Lab
      </button>
    </form>
  );
};

export default LabForm;