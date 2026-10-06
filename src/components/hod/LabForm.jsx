import { useState } from "react";

import { useLabs } from "../../context/LabContext";
import Select from "../common/Select";
import { DEPARTMENTS, SEMESTERS, SECTIONS } from "../../utils/constants";

const initialState = {
  labCode: "",
  labName: "",
  department: "",
  semester: "",
  section: "",
  building: "",
  floor: "",
  capacity: "",
};

const LabForm = () => {
  const { addLab } = useLabs();

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    addLab({
      ...form,

      capacity: Number(form.capacity),

      systems: Number(form.systems),
    });

    setForm(initialState);
  };

  return (
    <form onSubmit={submit} className="border p-5 rounded space-y-3">
      <h2 className="text-xl font-bold">Add Lab</h2>


<Select
  label="Department"
  name="department"
  value={form.department}
  onChange={handleChange}
  options={DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
  }))}
/> 


      <input
        name="labCode"
        placeholder="Lab Code"
        value={form.labCode}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="labName"
        placeholder="Lab Name"
        value={form.labName}
        onChange={handleChange}
        className="border p-2 w-full"
      />

<Select
  label="Semester"
  name="semester"
  value={form.semester}
  onChange={handleChange}
  options={SEMESTERS.map((sem) => ({
    value: sem,
    label: sem,
  }))}
/>

      <input
        name="capacity"
        placeholder="Capacity"
        value={form.capacity}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="building"
        placeholder="Building"
        value={form.building}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="floor"
        placeholder="Floor"
        value={form.floor}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="systems"
        placeholder="Number of Systems"
        value={form.systems}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button className="border px-4 py-2">Save Lab</button>
    </form>
  );
};

export default LabForm;
