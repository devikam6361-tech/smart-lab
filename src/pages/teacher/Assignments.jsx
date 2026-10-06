import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useAssignments } from "../../context/AssignmentContext";
import { useAuth } from "../../context/AuthContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabs } from "../../context/LabContext";

import AssignAssignmentStudents from "../../components/teacher/AssignAssignmentStudents";

const initialForm = {
  title: "",
  description: "",
  maxMarks: "",
  dueDate: "",
  labId: "",
};

const Assignments = () => {
  const { assignments, addAssignment, deleteAssignment } =
    useAssignments();

  const { currentUser } = useAuth();

  const { getTeacherByUserId } = useTeachers();

  const { labs } = useLabs();

  const teacher = getTeacherByUserId(currentUser?.id);

  const teacherLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id
  );

  const [form, setForm] = useState(initialForm);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    const selectedLab = teacherLabs.find(
      (lab) => lab.id === form.labId
    );

    addAssignment({
      ...form,

      teacherId: teacher.id,

      teacherName: teacher.name,

      department: selectedLab.department,

      semester: selectedLab.assignedSemester,

      section: selectedLab.assignedSection,
    });

    setForm(initialForm);
  };

  return (
    <DashboardLayout title="Assignments">

      <form
        onSubmit={submit}
        className="border rounded p-5 mb-8 space-y-4"
      >

        <h2 className="text-2xl font-bold">
          Create Assignment
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Assignment Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full"
          placeholder="Maximum Marks"
          name="maxMarks"
          value={form.maxMarks}
          onChange={handleChange}
        />

        <input
          type="date"
          className="border p-2 w-full"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <select
          className="border p-2 w-full"
          name="labId"
          value={form.labId}
          onChange={handleChange}
        >
          <option value="">
            Select Lab
          </option>

          {teacherLabs.map((lab) => (
            <option key={lab.id} value={lab.id}>
              {lab.labName}
            </option>
          ))}

        </select>

        <button className="border px-5 py-2">
          Create Assignment
        </button>

      </form>

      <h2 className="text-2xl font-bold mb-5">
        My Assignments
      </h2>

      <div className="space-y-4">

        {assignments
          .filter(
            (assignment) =>
              assignment.teacherId === teacher.id
          )
          .map((assignment) => (
            <div
              key={assignment.id}
              className="border rounded p-5 flex justify-between"
            >

              <div>

                <h3 className="text-lg font-bold">
                  {assignment.title}
                </h3>

                <p>{assignment.description}</p>

                <p>
                  Max Marks : {assignment.maxMarks}
                </p>

                <p>
                  Due : {assignment.dueDate}
                </p>

                <p>
                  Assigned :
                  {" "}
                  {assignment.assignedStudents.length}
                </p>

              </div>

              <div className="space-y-2">

                <button
                  className="border px-4 py-2 w-full"
                  onClick={() =>
                    setSelectedAssignment(
                      assignment
                    )
                  }
                >
                  Assign Students
                </button>

                <button
                  className="border px-4 py-2 w-full"
                  onClick={() =>
                    deleteAssignment(
                      assignment.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

      </div>

      {selectedAssignment && (
        <AssignAssignmentStudents
          assignment={selectedAssignment}
          onClose={() =>
            setSelectedAssignment(null)
          }
        />
      )}

    </DashboardLayout>
  );
};

export default Assignments;