import { useEffect, useRef, useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";

import useForm from "../../hooks/useForm";
import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";

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
  photo: "",
};

const StudentForm = ({
  editingStudent,
  onFinishEdit,
}) => {
  const { addStudent, updateStudent } = useStudents();
  const { labs } = useLabs();

  const {
    form,
    setForm,
    handleChange,
    resetForm,
  } = useForm(initialState);

  const fileInputRef = useRef(null);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setForm({
        ...initialState,
        ...editingStudent,
        assignedLabs: editingStudent.assignedLabs || [],
        photo: editingStudent.photo || "",
      });

      setPhotoError("");
    } else {
      setForm(initialState);
      setPhotoError("");
    }
  }, [editingStudent, setForm]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photo size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm({
        ...form,
        photo: reader.result,
      });
    };

    reader.onerror = () => {
      setPhotoError("Unable to read the selected photo.");
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = (event) => {
    event.stopPropagation();

    setForm({
      ...form,
      photo: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setPhotoError("");
  };

  const handleLabChange = (labId) => {
    const currentLabs = form.assignedLabs || [];

    if (currentLabs.includes(labId)) {
      setForm({
        ...form,
        assignedLabs: currentLabs.filter(
          (id) => id !== labId
        ),
      });
    } else {
      setForm({
        ...form,
        assignedLabs: [
          ...currentLabs,
          labId,
        ],
      });
    }
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.usn || !form.usn.trim()) {
      alert("Please enter USN.");
      return;
    }

    if (!form.name || !form.name.trim()) {
      alert("Please enter student name.");
      return;
    }

    if (!form.photo) {
      setPhotoError("Please upload the student's photo.");
      return;
    }

    if (editingStudent) {
      updateStudent(
        editingStudent.id,
        form
      );

      onFinishEdit();
      resetForm();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    addStudent(form);

    resetForm();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setPhotoError("");
  };

  return (
    <form
      onSubmit={submit}
      className="border p-5 mb-8 flex flex-col gap-4 bg-white rounded-lg"
    >
      <h2 className="text-xl font-semibold">
        {editingStudent
          ? "Edit Student"
          : "Add Student"}
      </h2>

      {/* STUDENT PHOTO */}

      <div className="flex flex-col items-center">
        <label className="text-sm font-medium mb-2 self-start">
          Student Photo
        </label>

        <div
          onClick={handlePhotoClick}
          className="relative w-40 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-50 transition"
        >
          {form.photo ? (
            <>
              <img
                src={form.photo}
                alt="Student Preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">
                📷
              </div>

              <p className="text-sm font-medium text-center">
                Click to Upload
              </p>

              <p className="text-xs text-gray-500 text-center mt-1">
                Student Photo
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {form.photo && (
          <button
            type="button"
            onClick={removePhoto}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Remove Photo
          </button>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Click the photo box to upload
        </p>

        {photoError && (
          <p className="text-sm text-red-600 mt-2 text-center">
            {photoError}
          </p>
        )}
      </div>

      {/* STUDENT DETAILS */}

      <Input
        label="USN"
        name="usn"
        value={form.usn || ""}
        onChange={handleChange}
      />

      <Input
        label="Student Name"
        name="name"
        value={form.name || ""}
        onChange={handleChange}
      />

      <Select
        label="Department"
        name="department"
        value={form.department || ""}
        onChange={handleChange}
        options={DEPARTMENTS.map((d) => ({
          value: d,
          label: d,
        }))}
      />

      <Select
        label="Semester"
        name="semester"
        value={form.semester || ""}
        onChange={handleChange}
        options={SEMESTERS.map((s) => ({
          value: s,
          label: s,
        }))}
      />

      <Select
        label="Section"
        name="section"
        value={form.section || ""}
        onChange={handleChange}
        options={SECTIONS.map((s) => ({
          value: s,
          label: s,
        }))}
      />

      {/* ASSIGNED LABS */}

      <div className="border rounded-lg p-4">
        <label className="text-sm font-semibold block mb-3">
          Assigned Labs
        </label>

        {labs && labs.length > 0 ? (
          <div className="flex flex-col gap-2">
            {labs.map((lab) => {
              const labId = String(lab.id);

              const selected = (
                form.assignedLabs || []
              ).some(
                (id) => String(id) === labId
              );

              return (
                <label
                  key={lab.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      handleLabChange(lab.id)
                    }
                    className="w-4 h-4"
                  />

                  <span className="text-sm">
                    {lab.name}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No labs available. Please add labs from HOD Lab Management.
          </p>
        )}
      </div>

      <Button type="submit">
        {editingStudent
          ? "Update Student"
          : "Add Student"}
      </Button>
    </form>
  );
};

export default StudentForm;