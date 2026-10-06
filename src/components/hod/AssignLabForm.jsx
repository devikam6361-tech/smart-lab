import { useState } from "react";

import { useLabs } from "../../context/LabContext";
import { useTeachers } from "../../context/TeacherContext";
// import { useSubjects } from "../../context/SubjectContext";

const AssignLabForm = () => {
  const { labs, assignLabDetails } = useLabs();

  const { teachers } = useTeachers();

  //   const { subjects } = useSubjects();

  const [form, setForm] = useState({
    labId: "",
    teacherId: "",
    subjectCode: "",
    semester: "",
    section: "",
  });

  const change = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    assignLabDetails(
      form.labId,

      form,
    );

    console.log(form);

    alert("Lab Assigned");
  };

  return (
    <form onSubmit={submit} className="border p-5 space-y-3">
      <h2 className="text-xl font-bold">Assign Lab</h2>

      <select name="labId" onChange={change} className="border p-2 w-full">
        <option>Select Lab</option>

        {labs.map((lab) => (
          <option key={lab.id} value={lab.id}>
            {lab.labName}
          </option>
        ))}
      </select>

      <select name="teacherId" onChange={change} className="border p-2 w-full">
        <option>Select Teacher</option>

        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>

      {/* <select
        name="subjectCode"
        onChange={change}
        className="border p-2 w-full"
      >
        <option>Select Subject</option>

        {subjects.map((subject) => (
          <option key={subject.subjectCode} value={subject.subjectCode}>
            {subject.subjectName}
          </option>
        ))}
      </select> */}

      <input
        name="semester"
        placeholder="Semester"
        onChange={change}
        className="border p-2 w-full"
      />

      <input
        name="section"
        placeholder="Section"
        onChange={change}
        className="border p-2 w-full"
      />

      <button className="border px-4 py-2">Assign</button>
    </form>
  );
};

export default AssignLabForm;
