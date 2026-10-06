import { useEffect } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";

import useForm from "../../hooks/useForm";

import { useStudents } from "../../context/StudentContext";
// import { useSubjects } from "../../context/SubjectContext";

import {
  DEPARTMENTS,
  SECTIONS,
  SEMESTERS,
} from "../../utils/constants";

const initialState = {
  usn: "",
  name: "",
  department: "",
  semester: "",
  section: "",
  assignedLabs: [],
};

const StudentForm = ({
  editingStudent,
  onFinishEdit,
}) => {
  const { addStudent, updateStudent } =
    useStudents();

  // const { subjects } = useSubjects();

  const {
    form,
    setForm,
    handleChange,
    resetForm,
  } = useForm(initialState);

  useEffect(() => {
    if (editingStudent) {
      setForm(editingStudent);
    }
  }, [editingStudent]);

  const submit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      updateStudent(
        editingStudent.id,
        form
      );

      onFinishEdit();

      resetForm();

      return;
    }

    addStudent(form);

    resetForm();
  };

  return (
    <form
      onSubmit={submit}
      className="border p-5 mb-8 flex flex-col gap-4"
    >
      <Input
        label="USN"
        name="usn"
        value={form.usn}
        onChange={handleChange}
      />

      <Input
        label="Student Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <Select
        label="Department"
        name="department"
        value={form.department}
        onChange={handleChange}
        options={DEPARTMENTS.map((d) => ({
          value: d,
          label: d,
        }))}
      />

      <Select
        label="Semester"
        name="semester"
        value={form.semester}
        onChange={handleChange}
        options={SEMESTERS.map((s) => ({
          value: s,
          label: s,
        }))}
      />

      <Select
        label="Section"
        name="section"
        value={form.section}
        onChange={handleChange}
        options={SECTIONS.map((s) => ({
          value: s,
          label: s,
        }))}
      />

      <Button type="submit">
        {editingStudent
          ? "Update Student"
          : "Add Student"}
      </Button>
    </form>
  );
};

export default StudentForm;